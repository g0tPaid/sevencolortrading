import { NextResponse } from "next/server";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { requireAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Application = { id: string; name: string; email: string; storeType: string; mobile: string; createdAt: string };
const filePath = () => path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH || "/tmp", "dropshipping-applications.jsonl");
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0,limit) : "";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ok:false,error:"Forbidden"},{status:403,headers});
  const length = Number(request.headers.get("content-length")||0);
  if(length>10000)return NextResponse.json({ok:false,error:"Request too large"},{status:413,headers});
  let body: Record<string,unknown>;
  try { const raw=await request.text();if(raw.length>10000)throw Error("too large");body=JSON.parse(raw);if(!body||typeof body!=="object")throw Error("invalid"); }
  catch{return NextResponse.json({ok:false,error:"Invalid application"},{status:400,headers});}
  const name=clean(body.name,120),email=clean(body.email,180),storeType=clean(body.storeType,100),mobile=clean(body.mobile,40);
  if(!name||!/^\S+@\S+\.\S+$/.test(email)||!storeType||!mobile||mobile.length<6)return NextResponse.json({ok:false,error:"Please provide valid name, email, store type and mobile."},{status:400,headers});
  const record:Application={id:"DS-"+randomUUID().slice(0,8).toUpperCase(),name,email,storeType,mobile,createdAt:new Date().toISOString()};
  try {
    const destination=filePath();
    await mkdir(path.dirname(destination),{recursive:true});
    await appendFile(destination,JSON.stringify(record)+"\n",{encoding:"utf8",mode:0o600});
  } catch(error) {
    console.error("[dropshipping application] storage failed",error);
    return NextResponse.json({ok:false,error:"Unable to save application. Please try again."},{status:503,headers});
  }
  const key=process.env.RESEND_API_KEY;
  if(key){
    try {
      const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({
        from:process.env.FACTORY_NOTIFY_FROM||"Sourcing Center <onboarding@resend.dev>",
        to:[process.env.FACTORY_NOTIFY_EMAIL||"info@sevencolortrading.com"],
        subject:`New dropshipping partner application ${record.id}`,
        text:`New dropshipping application\n\nReference: ${record.id}\nName: ${name}\nEmail: ${email}\nStore: ${storeType}\nMobile: ${mobile}\nSubmitted: ${record.createdAt}\n\nReview saved applications in the admin API.`
      })});
      if(!res.ok)console.error("[dropshipping application] email delivery failed",res.status);
    } catch(error){console.error("[dropshipping application] email error",error);}
  }
  return NextResponse.json({ok:true,reference:record.id},{status:201,headers});
}

export async function GET(request:Request){
  const auth=await requireAdminSession(request);
  if(!auth.ok)return auth.response;
  try{
    const content=await readFile(filePath(),"utf8");
    const applications=content.split("\n").filter(Boolean).map(line=>JSON.parse(line) as Application).reverse();
    return NextResponse.json({ok:true,applications},{headers});
  }catch(error){
    if((error as NodeJS.ErrnoException).code==="ENOENT")return NextResponse.json({ok:true,applications:[]},{headers});
    return NextResponse.json({ok:false,error:"Unable to load applications"},{status:500,headers});
  }
}
