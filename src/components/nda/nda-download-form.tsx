"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { officialSealBase64 } from "./official-seal";

const clauses: [string,string][] = [
["1. PURPOSE","The parties wish to discuss or work together on product sourcing, supplier identification, product development, manufacturing, OEM/ODM, packaging, quality control, logistics, purchasing and related commercial activities (the Purpose). Either party may disclose confidential information to the other."],
["2. CONFIDENTIAL INFORMATION","Confidential Information includes non-public information disclosed in writing, electronically, visually, orally or otherwise, including product ideas, designs, drawings, specifications, samples, prototypes, photographs, videos, pricing, quotations, supplier or factory information, manufacturing methods, business plans, customer information, technical information, intellectual property and source files, or information reasonably understood to be confidential."],
["3. EXCLUSIONS","Confidential Information excludes information the receiving party can demonstrate was publicly available without breach, already lawfully known before disclosure, independently developed without using Confidential Information, or lawfully received from a third party without a confidentiality duty."],
["4. CONFIDENTIALITY OBLIGATIONS","Each receiving party shall use Confidential Information only for the Purpose; protect it with reasonable care and at least the care used for its own comparable information; disclose it only to personnel, professional advisers, contractors or providers with a legitimate need to know who are subject to confidentiality obligations; and otherwise obtain the disclosing party's prior written consent."],
["5. CUSTOMER PRODUCT AND INTELLECTUAL PROPERTY","Original product concepts, designs, drawings, specifications, brand materials, artwork, formulas, prototypes and other intellectual property provided by the Customer shall be treated as Confidential Information and used only for the agreed Purpose. No ownership of pre-existing intellectual property transfers under this Agreement."],
["6. SUPPLIER AND FACTORY INFORMATION","Supplier, factory, manufacturer and sourcing information shared by Sourcing Center shall be treated as Confidential Information. The Customer shall not knowingly use it outside the agreed commercial relationship or disclose it to unrelated third parties without prior written consent, except as required by law."],
["7. REQUIRED DISCLOSURE","A party required by law, court order or governmental authority to disclose Confidential Information may disclose only what is legally required and, where permitted, shall give reasonable prior notice so protective measures may be sought."],
["8. RETURN OR DESTRUCTION","Upon written request, the receiving party shall reasonably return or destroy Confidential Information, except secure automatic backups or records retained under law or for legitimate compliance. Retained information remains confidential."],
["9. TERM","This Agreement begins on the Effective Date and continues for two (2) years unless terminated earlier by written agreement. Confidentiality obligations continue for three (3) years after the last disclosure, except trade secrets remain protected while they qualify as trade secrets under applicable law."],
["10. NO OBLIGATION OR WARRANTY","Neither party is required to enter a purchase, manufacturing, sourcing, distribution or other transaction. Confidential Information is provided without warranty unless otherwise expressly agreed in writing."],
["11. REMEDIES","Unauthorized disclosure or misuse may cause harm not adequately compensated by damages alone. The disclosing party may seek remedies available under applicable law, including injunctive or equitable relief where appropriate."],
["12. GENERAL","This Agreement is the parties' understanding on confidentiality for the Purpose and may be amended only in writing signed by both parties. Assignment requires written consent except to a successor in a merger, reorganization or sale of substantially all relevant assets. If a provision is unenforceable, remaining provisions continue."],
["13. GOVERNING LAW AND JURISDICTION","This Agreement is governed by the laws of the People's Republic of China, without regard to conflict-of-law principles. The parties shall first seek an amicable resolution; otherwise disputes shall be submitted to a competent court having jurisdiction in Xiamen, Fujian, China, unless otherwise agreed in writing."],
];

function escapePdf(s:string){return s.normalize("NFKD").replace(/[^\x20-\x7E]/g,"?").replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");}
function wrap(text:string,max=90){const words=text.split(/\s+/);const lines:string[]=[];let line="";for(const w of words){if((line+" "+w).length>max){if(line)lines.push(line);line=w;}else line=line?line+" "+w:w;}if(line)lines.push(line);return lines;}
function generatePdf(customer:{name:string;company:string;phone:string}){
 const pages:string[][]=[];let lines:string[]=[];let y=780;
 const text=(value:string,size=10,bold=false,x=48,color="0.12 0.16 0.23")=>{lines.push(`${color} rg BT /${bold?"F2":"F1"} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdf(value)}) Tj ET`);y-=size+6;};
 const newPage=()=>{if(lines.length)pages.push(lines);lines=[];y=780;lines.push("0.89 0.07 0.20 rg 0 826 595 16 re f");text("SOURCING CENTER  |  CONFIDENTIAL LEGAL DOCUMENT",9,true,48,"0.55 0.12 0.21");y-=10;};
 newPage();text("MUTUAL NON-DISCLOSURE",23,true);text("AGREEMENT",23,true);y-=13;
 text("PARTY A: Xiamen Ajmal Seven Color Trading Co Ltd",10,true);text("Trading as Sourcing Center / sourcing.center",10);
 text("PARTY B: "+customer.name,10,true);if(customer.company)text("Company: "+customer.company,10);text("Phone: "+customer.phone,10);
 const date=new Date().toISOString().slice(0,10);text("Effective Date: "+date,10);y-=14;
 for(const [title,body] of clauses){const wrapped=wrap(body,95);const height=29+wrapped.length*14;if(y-height<88)newPage();text(title,11,true);for(const row of wrapped)text(row,9.5);y-=12;}
 if(y<450)newPage();
 text("PARTY DETAILS AND SIGNATURES",13,true);y-=9;
 text("PARTY A - SOURCING CENTER",11,true);text("Xiamen Ajmal Seven Color Trading Co Ltd",9.5);text("Representative: AJMAL ABDUL JABBAR AHAMED",9.5);text("Managing Director",9.5);
 y-=12;
 lines.push(`q 300 0 0 144 48 ${y-144} cm /Seal Do Q`);y-=152;
 text("Date: _________________________",9);
 y-=18;text("PARTY B - CUSTOMER",11,true);text("Name: "+customer.name,9.5);if(customer.company)text("Company: "+customer.company,9.5);text("Phone: "+customer.phone,9.5);text("Customer signature: _________________________",9);text("Date: _________________________",9);
 y-=20;for(const line of wrap("This document is a draft for review. The customer signature is required. The company signature and stamps are reproduced from the supplied artwork; customer must sign separately.",95))text(line,8);
 pages.push(lines);
 const imageBinary=atob(officialSealBase64);
 const imageBytes=Uint8Array.from(imageBinary,ch=>ch.charCodeAt(0));
 const objects:string[]=["<< /Type /Catalog /Pages 2 0 R >>","","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
 const pageIds:number[]=[];pages.forEach((p)=>{const pid=objects.length+1;pageIds.push(pid);const content=p.join("\n")+"\n";objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Seal IMAGE_OBJECT_ID 0 R >> >> /Contents ${pid+1} 0 R >>`);objects.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);});
 objects[1]=`<< /Type /Pages /Kids [${pageIds.map(id=>id+" 0 R").join(" ")}] /Count ${pages.length} >>`;
 const imageId=objects.length+1;
 const encoder=new TextEncoder();const chunks:Uint8Array[]=[];let total=0;
 const add=(v:string|Uint8Array)=>{const b=typeof v==="string"?encoder.encode(v):v;chunks.push(b);total+=b.length;};
 const offsets=[0];add("%PDF-1.4\n");
 objects.forEach((obj,i)=>{offsets.push(total);add(`${i+1} 0 obj\n${obj.replace("IMAGE_OBJECT_ID",String(imageId))}\nendobj\n`);});
 offsets.push(total);
 add(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width 360 /Height 173 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
 add(imageBytes);add("\nendstream\nendobj\n");
 const start=total;add(`xref\n0 ${imageId+1}\n0000000000 65535 f \n`);
 offsets.slice(1).forEach(n=>add(`${String(n).padStart(10,"0")} 00000 n \n`));
 add(`trailer\n<< /Size ${imageId+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
 const out=new Uint8Array(total);let cursor=0;chunks.forEach(c=>{out.set(c,cursor);cursor+=c.length;});
 return new Blob([out],{type:"application/pdf"});
}
export function NdaDownloadForm(){
 const [name,setName]=useState("");const [company,setCompany]=useState("");const [phone,setPhone]=useState("");
 const download=(e:React.FormEvent)=>{e.preventDefault();const url=URL.createObjectURL(generatePdf({name,company,phone}));const a=document.createElement("a");a.href=url;a.download="Sourcing-Center-NDA-"+name.trim().replace(/[^a-z0-9]+/gi,"-")+".pdf";a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);};
 return <section id="nda" className="mt-12 rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-lg sm:p-9">
 <div className="flex items-center gap-3"><FileText className="h-8 w-8 text-accent"/><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Confidentiality first</p><h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Download your NDA</h2></div></div>
 <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Complete your details to generate a personalized mutual non-disclosure agreement covering sourcing, product development, OEM/ODM and supplier discussions. Review and sign the agreement before sharing confidential materials.</p>
 <form onSubmit={download} className="mt-6 grid gap-4 sm:grid-cols-2">
 <label className="grid gap-2 text-sm font-semibold text-ink">Full name *<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="Your full name"/></label>
 <label className="grid gap-2 text-sm font-semibold text-ink">Company name (optional)<input maxLength={120} value={company} onChange={e=>setCompany(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="Company or trading name"/></label>
 <label className="grid gap-2 text-sm font-semibold text-ink">Phone number *<input required type="tel" maxLength={40} value={phone} onChange={e=>setPhone(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="+971 ..."/></label>
 <div className="flex items-end"><button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white hover:opacity-90"><Download className="h-5 w-5"/> Generate & download NDA (PDF)</button></div>
 </form>
 <p className="mt-4 text-xs leading-relaxed text-muted">Your information is used locally in your browser to create the downloadable PDF. The NDA retains its original PRC governing-law and Xiamen jurisdiction provisions. It is not signed on your behalf; obtain signatures from both parties before relying on it as an executed agreement.</p>
 </section>;
}
