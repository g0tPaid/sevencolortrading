import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSessionFromCookies } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Application={id:string;name:string;email:string;storeType:string;mobile:string;website?:string;websiteNotReady?:boolean;productLink?:string;productImage?:string;productImageName?:string;createdAt:string};
export default async function DropshippingApplicationsAdmin(){
  const cookieHeader=(await cookies()).toString();
  const session=await getSessionFromCookies(cookieHeader);
  if(!session)redirect("/admin");
  const file=path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH||"/tmp","dropshipping-applications.jsonl");
  let applications:Application[]=[];
  try{applications=(await readFile(file,"utf8")).split("\n").filter(Boolean).map(line=>JSON.parse(line) as Application).reverse();}
  catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")throw error;}
  return <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-8">
    <h1 className="font-display text-3xl font-semibold text-ink">Dropshipping partner applications</h1>
    <p className="mt-2 text-muted">{applications.length} application{applications.length===1?"":"s"} received</p>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-background/70">
      <table className="w-full min-w-[740px] text-left text-sm">
        <thead className="border-b border-ink/10"><tr>{["Reference","Date","Name","Email","Store type","Mobile","Website","Product"].map(x=><th key={x} className="p-4 font-semibold">{x}</th>)}</tr></thead>
        <tbody>{applications.map(a=><tr key={a.id} className="border-b border-ink/10"><td className="p-4">{a.id}</td><td className="p-4">{new Date(a.createdAt).toLocaleString("en-GB",{timeZone:"UTC"})} UTC</td><td className="p-4">{a.name}</td><td className="p-4"><a href={`mailto:${a.email}`} className="underline">{a.email}</a></td><td className="p-4">{a.storeType}</td><td className="p-4">{a.mobile}</td><td className="p-4">{a.websiteNotReady?"Not ready":a.website?<a href={a.website} target="_blank" rel="noopener noreferrer" className="underline">Visit store</a>:"—"}</td><td className="p-4">{a.productLink&&<a href={a.productLink} target="_blank" rel="noopener noreferrer" className="mr-3 underline">Product link</a>}{a.productImage&&<a href={a.productImage} download={a.productImageName||"product-image"} className="underline">Image ({a.productImageName||"file"})</a>}</td></tr>)}</tbody>
      </table>
      {!applications.length&&<p className="p-6 text-muted">No applications yet.</p>}
    </div>
  </main>;
}
