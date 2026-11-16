"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Download, FileText, X } from "lucide-react";

type Application = { name: string; email: string; storeType: string; mobile: string; website: string; websiteNotReady: boolean; productLink: string; productImage: string; productImageName: string };
const empty: Application = { name: "", email: "", storeType: "Shopify", mobile: "", website: "", websiteNotReady: false, productLink: "", productImage: "", productImageName: "" };
const enc = (s: string) => s.replace(/[^\x20-\x7e]/g, "?").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
function makePdf(data: Application): Blob {
  const commands: string[] = [];
  const text = (x: number, y: number, size: number, value: string, color = "0.12 0.14 0.18") => {
    commands.push(`${color} rg BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${enc(value)}) Tj ET`);
  };
  commands.push("q 0.7071 0.7071 -0.7071 0.7071 112 280 cm");
  text(0, 0, 55, "CONFIDENTIAL", "0.91 0.92 0.94");
  commands.push("Q");
  commands.push("0.89 0.10 0.27 rg 0 825 595 17 re f");
  commands.push("0.96 0.97 0.98 rg 0 719 595 106 re f");
  // Seven Color symbol traced from the actual sourcing.center site icon.
  commands.push("q 0.58 0 0 -0.58 42 809 cm 0.88 0.11 0.28 rg");
  commands.push("8 10 m 80 10 l 76 21 l 36 21 l 18 98 l 4 98 l 24 21 l 64 21 l 66 10 l 8 10 l h f");
  commands.push("66 21 m 44 98 l 57 98 l 79 21 l h f");
  commands.push("18 98 m 27 91 l 34 100 l 25 107 l h f Q");
  text(112, 777, 23, "sourcing.center");
  text(112, 757, 9, "BY SEVEN COLOR TRADING CO LTD", "0.38 0.42 0.48");
  text(438, 778, 9, "PRIVATE DOCUMENT", "0.88 0.11 0.28");
  text(42, 689, 19, "DROPSHIPPING PARTNER APPLICATION");
  text(42, 665, 10, "PARTNER ONBOARDING  /  FOR REVIEW ONLY", "0.40 0.44 0.50");
  text(42, 643, 9, "Prepared: " + new Date().toISOString().slice(0,10) + "  |  Status: Pending review", "0.40 0.44 0.50");
  commands.push("0.89 0.90 0.93 RG 42 628 m 553 628 l S");
  const fields: [string,string][] = [["Applicant name",data.name],["Email address",data.email],["Store platform",data.storeType],["Mobile number",data.mobile]];
  fields.forEach(([label,value],i) => {
    const y=594-i*63;
    text(42,y,10,label.toUpperCase(),"0.44 0.47 0.52");
    text(42,y-27,15,value.slice(0,65));
    commands.push(`0.9 0.91 0.93 RG 42 ${y-42} m 553 ${y-42} l S`);
  });
  text(42, 318, 9, "STORE WEBSITE: " + (data.websiteNotReady ? "Not ready yet" : (data.website || "Not provided")).slice(0, 74));
  text(42, 303, 9, "PRODUCT LINK: " + (data.productLink || "Not provided").slice(0, 75));
  text(42, 288, 9, "PRODUCT IMAGE: " + (data.productImageName || "Not attached").slice(0, 74));
  commands.push("0.95 0.96 0.98 rg 42 269 511 31 re f");
  text(53, 279, 11, "APPLICATION INSTRUCTIONS");
  text(53, 250, 9, "1. Review your name, email, store type and mobile number.");
  text(53, 232, 9, "2. Click Submit application on the website to send your details.");
  text(53, 214, 9, "3. Our team reviews the request and contacts you for next steps.");
  text(53, 196, 9, "4. Submission does not mean automatic partner approval.");
  commands.push("0.96 0.97 0.98 rg 42 113 511 62 re f");
  text(53, 155, 10, "PRIVACY AND DATA HANDLING");
  text(53, 137, 8.5, "We store submitted details in our application records for review and follow-up.");
  text(53, 123, 8.5, "Authorized administrators can access them. Contact us for privacy requests.");
  text(42, 91, 9, "Xiamen Ajmal Seven Color Trading Co Ltd");
  text(42, 75, 9, "info@sevencolortrading.com  |  sourcing.center");
  text(42, 45, 8, "CONFIDENTIAL - For the applicant and authorized Sourcing Center personnel only.");
  text(519, 45, 8, "1 / 1");
  const stream=commands.join("\n");
  const objects=[
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf="%PDF-1.4\n";const offsets=[0];
  objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`;});
  const start=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(n=>pdf+=`${String(n).padStart(10,"0")} 00000 n \n`);
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
}

export function DropshippingApplication() {
  const [open,setOpen]=useState(false);
  const [step,setStep]=useState<"form"|"review"|"done">("form");
  const [data,setData]=useState<Application>(empty);
  const [pdfUrl,setPdfUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [ref,setRef]=useState("");
  useEffect(()=>()=>{if(pdfUrl)URL.revokeObjectURL(pdfUrl);},[pdfUrl]);
  const update=(key:keyof Application,value:string)=>setData(v=>({...v,[key]:value}));
  const preview=()=>{
    setError("");
    if(!data.name.trim()||!/^\S+@\S+\.\S+$/.test(data.email)||!data.mobile.trim()||!data.storeType.trim()){setError("Please complete all fields with a valid email.");return;}
    if(pdfUrl)URL.revokeObjectURL(pdfUrl);
    const url=URL.createObjectURL(makePdf(data));
    setPdfUrl(url);setStep("review");
  };
  const submit=async()=>{
    setBusy(true);setError("");
    try{
      const res=await fetch("/api/dropshipping/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const json=await res.json();
      if(!res.ok||!json.ok)throw new Error(json.error||"Submission failed.");
      setRef(json.reference);setStep("done");
    }catch(e){setError(e instanceof Error?e.message:"Unable to submit. Please retry.");}
    finally{setBusy(false);}
  };
  return <section className="mt-8 rounded-[1.5rem] border border-ink/10 bg-background/70 p-6 sm:p-8" aria-labelledby="dropship-application-title">
    <h2 id="dropship-application-title" className="font-display text-2xl font-semibold text-ink">Become a dropshipping partner</h2>
    <p className="mt-2 max-w-2xl text-sm text-muted">Apply with your store details. Review your pre-filled PDF application before sending it to our team.</p>
    <button type="button" onClick={()=>{setOpen(true);setStep("form");setError("");}} className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">Apply now <ArrowRight className="h-4 w-4"/></button>
    {open&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Dropshipping partner application">
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-7"><h3 className="text-lg font-bold">{step==="form"?"Partner application":step==="review"?"Review your PDF":"Application submitted"}</h3><button type="button" aria-label="Close" onClick={()=>setOpen(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5"/></button></div>
        <div className="overflow-y-auto p-5 sm:p-7">
          {step==="form"&&<form id="dropshipping-partner-form" onSubmit={e=>{e.preventDefault();preview();}} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">Full name<input required maxLength={120} autoComplete="name" value={data.name} onChange={e=>update("name",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="Your full name"/></label>
            <label className="grid gap-1.5 text-sm font-semibold">Email<input required type="email" maxLength={180} autoComplete="email" value={data.email} onChange={e=>update("email",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="name@example.com"/></label>
            <label className="grid gap-1.5 text-sm font-semibold">Store type<select required value={["Shopify","WooCommerce","Other"].includes(data.storeType)?data.storeType:"Other"} onChange={e=>update("storeType",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal"><option>Shopify</option><option>WooCommerce</option><option>Other</option></select></label>
            {data.storeType==="Other"&&<label className="grid gap-1.5 text-sm font-semibold">Specify store type<input required maxLength={100} value={data.storeType==="Other"?"":data.storeType} onChange={e=>update("storeType",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="Amazon, Etsy, custom store..."/></label>}
            <label className="grid gap-1.5 text-sm font-semibold">Mobile number<input required type="tel" maxLength={40} autoComplete="tel" value={data.mobile} onChange={e=>update("mobile",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="+971 50 123 4567"/></label>
            <fieldset className="grid gap-3 rounded-xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-bold">Your store website</legend>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.websiteNotReady} onChange={e=>setData(v=>({...v,websiteNotReady:e.target.checked,website:e.target.checked?"":v.website}))} className="h-4 w-4 accent-red-600"/> My website is not ready yet</label>
              {!data.websiteNotReady&&<label className="grid gap-1.5 text-sm font-semibold">Website link (optional)<input type="url" maxLength={300} value={data.website} onChange={e=>update("website",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="https://yourstore.com"/></label>}
            </fieldset>
            <fieldset className="grid gap-3 rounded-xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-bold">Products you want to source (optional)</legend>
              <label className="grid gap-1.5 text-sm font-semibold">Product link<input type="url" maxLength={500} value={data.productLink} onChange={e=>update("productLink",e.target.value)} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="Alibaba, AliExpress, Temu, 1688 or other"/></label>
              <label className="grid gap-1.5 text-sm font-semibold">Or upload a product image<input type="file" accept="image/jpeg,image/png,image/webp" className="w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm font-normal" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>700000){setError("Product image must be under 700 KB.");e.target.value="";return;}const reader=new FileReader();reader.onload=()=>{setData(v=>({...v,productImage:String(reader.result||""),productImageName:file.name.slice(0,100)}));setError("");};reader.readAsDataURL(file);}}/></label>
              {data.productImageName&&<p className="text-xs text-green-700">Attached: {data.productImageName} <button type="button" className="underline" onClick={()=>setData(v=>({...v,productImage:"",productImageName:""}))}>Remove</button></p>}
              <p className="text-xs text-slate-500">Both fields are optional. Uploads are kept with your application for review.</p>
            </fieldset>
            <p className="text-xs text-slate-500">We store submitted details for application review and follow-up. Authorized administrators can access them.</p>
            <button type="submit" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white">Generate & review PDF</button>
          </form>}
          {step==="review"&&<div>
            <p className="mb-3 text-sm text-slate-600">Check the details in your application PDF, then select Submit application to send it to our backend.</p>
            <div className="h-[46vh] min-h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"><iframe title="Application PDF preview" src={pdfUrl} className="h-full w-full"/></div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold"><FileText className="h-4 w-4"/>Open PDF</a>
              <a href={pdfUrl} download="sourcing-center-dropshipping-application.pdf" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold"><Download className="h-4 w-4"/>Download PDF</a>
              <button type="button" onClick={()=>setStep("form")} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">Edit details</button>
              <button type="button" disabled={busy} onClick={submit} className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy?"Submitting...":"Submit application"}</button>
            </div>
          </div>}
          {step==="done"&&<div className="py-8 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-green-600"/><p className="mt-4 text-xl font-semibold">Application received</p><p className="mt-2 text-sm text-slate-600">Reference: {ref}. Our team will review your application.</p><a href={pdfUrl} download="sourcing-center-dropshipping-application.pdf" className="mt-5 inline-flex rounded-full border px-5 py-3 text-sm font-semibold">Download your PDF</a></div>}
          {error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </div>}
  </section>;
}
