"use client";

import { useState, type FormEvent } from "react";
import { Download, FileText } from "lucide-react";
import { officialSealBase64 } from "./official-seal";

// JPEG prepared from public/seven-color-mark-clear.png for the PDF header.
const companyLogoBase64 = "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";

// Calling codes from Google libphonenumber's PhoneNumberMetadata.xml.
// An asterisk marks a simple national trunk prefix of 0.
const callingCodeData = `
AC:247 AD:376 AE:971* AF:93* AG:1 AI:1 AL:355* AM:374*
AO:244 AR:54 AS:1 AT:43* AU:61* AW:297 AX:358* AZ:994*
BA:387* BB:1 BD:880* BE:32* BF:226 BG:359* BH:973 BI:257
BJ:229 BL:590* BM:1 BN:673 BO:591* BQ:599 BR:55 BS:1
BT:975 BW:267 BY:375 BZ:501 CA:1 CC:61 CD:243* CF:236
CG:242 CH:41* CI:225 CK:682 CL:56 CM:237 CN:86* CO:57*
CR:506 CU:53* CV:238 CW:599 CX:61 CY:357 CZ:420 DE:49*
DJ:253 DK:45 DM:1 DO:1 DZ:213* EC:593* EE:372 EG:20*
EH:212* ER:291* ES:34 ET:251* FI:358* FJ:679 FK:500 FM:691
FO:298 FR:33* GA:241 GB:44* GD:1 GE:995* GF:594* GG:44
GH:233* GI:350 GL:299 GM:220 GN:224 GP:590* GQ:240 GR:30
GT:502 GU:1 GW:245 GY:592 HK:852 HN:504 HR:385* HT:509
HU:36 ID:62* IE:353* IL:972* IM:44 IN:91* IO:246 IQ:964*
IR:98* IS:354 IT:39 JE:44 JM:1 JO:962* JP:81 KE:254*
KG:996* KH:855* KI:686* KM:269 KN:1 KP:850* KR:82* KW:965
KY:1 KZ:7 LA:856* LB:961* LC:1 LI:423* LK:94* LR:231*
LS:266 LT:370* LU:352 LV:371 LY:218* MA:212* MC:377* MD:373*
ME:382* MF:590* MG:261 MH:692 MK:389* ML:223 MM:95* MN:976*
MO:853 MP:1 MQ:596* MR:222 MS:1 MT:356 MU:230 MV:960
MW:265* MX:52 MY:60* MZ:258 NA:264* NC:687 NE:227 NF:672
NG:234* NI:505 NL:31* NO:47 NP:977* NR:674 NU:683 NZ:64*
OM:968 PA:507 PE:51* PF:689 PG:675 PH:63* PK:92* PL:48
PM:508* PR:1 PS:970* PT:351 PW:680 PY:595* QA:974 RE:262*
RO:40* RS:381* RU:7 RW:250* SA:966* SB:677 SC:248 SD:249*
SE:46* SG:65 SH:290 SI:386* SJ:47 SK:421* SL:232* SM:378
SN:221 SO:252* SR:597 SS:211* ST:239 SV:503 SX:1 SY:963*
SZ:268 TA:290 TC:1 TD:235 TG:228 TH:66* TJ:992 TK:690
TL:670 TM:993 TN:216 TO:676 TR:90* TT:1 TV:688 TW:886*
TZ:255* UA:380* UG:256* US:1 UY:598* UZ:998 VA:39 VC:1
VE:58* VG:1 VI:1 VN:84* VU:678 WF:681 WS:685 XK:383*
YE:967* YT:262* ZA:27* ZM:260* ZW:263*
`.trim();
const countryNames = new Intl.DisplayNames("en", { type: "region" });
const callingCountries = callingCodeData.split(/\s+/).map((entry) => {
  const [region, code] = entry.split(":");
  return {
    region,
    name: countryNames.of(region) ?? region,
    code: code.replace("*", ""),
    hasTrunkZero: code.endsWith("*"),
  };
}).sort((a, b) => a.name.localeCompare(b.name, "en"));

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
function generatePdf(customer:{name:string;company:string;phone:string;address:string}){
 const pages:string[][]=[];let lines:string[]=[];let y=780;
 const text=(value:string,size=10,bold=false,x=48,color="0.12 0.16 0.23")=>{lines.push(`${color} rg BT /${bold?"F2":"F1"} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdf(value)}) Tj ET`);y-=size+6;};
 const newPage=()=>{if(lines.length)pages.push(lines);lines=[];y=780;lines.push("0.89 0.07 0.20 rg 0 826 595 16 re f");lines.push("q 28 0 0 28 48 776 cm /Logo Do Q");text("SOURCING CENTER  |  CONFIDENTIAL LEGAL DOCUMENT",9,true,86,"0.55 0.12 0.21");y-=10;};
 newPage();text("MUTUAL NON-DISCLOSURE",23,true);text("AGREEMENT",23,true);y-=13;
 text("PARTY A: Xiamen Ajmal Seven Color Trading Co Ltd",10,true);text("Trading as Sourcing Center / sourcing.center",10);
 text("PARTY B: "+customer.name,10,true);if(customer.company)text("Company: "+customer.company,10);text("Phone: "+customer.phone,10);for(const row of wrap("Address: "+customer.address,85))text(row,10);
 const date=new Date().toISOString().slice(0,10);text("Effective Date: "+date,10);y-=14;
 for(const [title,body] of clauses){const wrapped=wrap(body,95);const height=29+wrapped.length*14;if(y-height<88)newPage();text(title,11,true);for(const row of wrapped)text(row,9.5);y-=12;}
 if(y<450)newPage();
 text("PARTY DETAILS AND SIGNATURES",13,true);y-=9;
 text("PARTY A - SOURCING CENTER",11,true);text("Xiamen Ajmal Seven Color Trading Co Ltd",9.5);text("Representative: AJMAL ABDUL JABBAR AHAMED",9.5);text("Managing Director",9.5);
 y-=12;
 lines.push(`q 300 0 0 144 48 ${y-144} cm /Seal Do Q`);y-=152;
 text("Date: _________________________",9);
 y-=18;text("PARTY B - CUSTOMER",11,true);text("Name: "+customer.name,9.5);if(customer.company)text("Company: "+customer.company,9.5);text("Phone: "+customer.phone,9.5);for(const row of wrap("Address: "+customer.address,85))text(row,9.5);text("Customer signature: _________________________",9);text("Date: _________________________",9);
 y-=20;for(const line of wrap("This document is a draft for review. The customer signature is required. The company signature and stamps are reproduced from the supplied artwork; customer must sign separately.",95))text(line,8);
 pages.push(lines);

 const objects:string[]=["<< /Type /Catalog /Pages 2 0 R >>","","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
 const pageIds:number[]=[];pages.forEach((p)=>{const pid=objects.length+1;pageIds.push(pid);const content=p.join("\n")+"\n";objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Seal SEAL_OBJECT_ID 0 R /Logo LOGO_OBJECT_ID 0 R >> >> /Contents ${pid+1} 0 R >>`);objects.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);});
 objects[1]=`<< /Type /Pages /Kids [${pageIds.map(id=>id+" 0 R").join(" ")}] /Count ${pages.length} >>`;
 const sealId = objects.length + 1;
 const logoId = sealId + 1;
 const encoder=new TextEncoder();const chunks:Uint8Array[]=[];let total=0;
 const add=(v:string|Uint8Array)=>{const b=typeof v==="string"?encoder.encode(v):v;chunks.push(b);total+=b.length;};
 const offsets=[0];add("%PDF-1.4\n");
 objects.forEach((obj, i) => {
   offsets.push(total);
   const content = obj.replace("SEAL_OBJECT_ID", String(sealId)).replace("LOGO_OBJECT_ID", String(logoId));
   add(`${i + 1} 0 obj\n${content}\nendobj\n`);
 });
 function addJpeg(id: number, base64: string, width: number, height: number) {
   const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
   offsets.push(total);
   add(`${id} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`);
   add(bytes);
   add("\nendstream\nendobj\n");
 }
 addJpeg(sealId, officialSealBase64, 360, 173);
 addJpeg(logoId, companyLogoBase64, 96, 96);
 const start=total;add(`xref\n0 ${logoId+1}\n0000000000 65535 f \n`);
 offsets.slice(1).forEach(n=>add(`${String(n).padStart(10,"0")} 00000 n \n`));
 add(`trailer\n<< /Size ${logoId+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
 const out=new Uint8Array(total);let cursor=0;chunks.forEach(c=>{out.set(c,cursor);cursor+=c.length;});
 return new Blob([out],{type:"application/pdf"});
}
export function NdaDownloadForm(){
 const [name,setName]=useState("");const [company,setCompany]=useState("");const [phone,setPhone]=useState("");const [address,setAddress]=useState("");
 const [region, setRegion] = useState("");
 const [phoneError, setPhoneError] = useState("");

 function download(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   const entered = phone.trim();
   const digits = entered.replace(/\D/g, "");
   const country = callingCountries.find((item) => item.region === region);
   const international = entered.startsWith("+");

   if (!international && !country) {
     setPhoneError("Choose a country code or enter the full number starting with +.");
     event.currentTarget.querySelector("select")?.focus();
     return;
   }

   const local = country?.hasTrunkZero ? digits.replace(/^0/, "") : digits;
   const fullDigits = international ? digits : (country?.code ?? "") + local;
   if (!/^\+?[\d\s().-]+$/.test(entered) || !/^[1-9]\d{3,14}$/.test(fullDigits) || (!international && local.length < 4)) {
     setPhoneError("Enter a complete phone number, including its area code if applicable.");
     event.currentTarget.querySelector("input[type=tel]")?.focus();
     return;
   }

   setPhoneError("");
   const url = URL.createObjectURL(generatePdf({ name, company, phone: "+" + fullDigits, address }));
   const link = document.createElement("a");
   link.href = url;
   link.download = "Sourcing-Center-NDA-" + name.trim().replace(/[^a-z0-9]+/gi, "-") + ".pdf";
   link.click();
   setTimeout(() => URL.revokeObjectURL(url), 2000);
 }
 return <section id="nda" className="mt-12 rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-lg sm:p-9">
 <div className="flex items-center gap-3"><FileText className="h-8 w-8 text-accent"/><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Confidentiality first</p><h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Download your NDA</h2></div></div>
 <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Complete your details to generate a personalized mutual non-disclosure agreement covering sourcing, product development, OEM/ODM and supplier discussions. Review and sign the agreement before sharing confidential materials.</p>
 <form onSubmit={download} className="mt-6 grid gap-4 sm:grid-cols-2">
 <label className="grid gap-2 text-sm font-semibold text-ink">Full name *<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="Your full name"/></label>
 <label className="grid gap-2 text-sm font-semibold text-ink">Company name (optional)<input maxLength={120} value={company} onChange={e=>setCompany(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="Company or trading name"/></label>
 <fieldset className="min-w-0 sm:col-span-2">
   <legend className="text-sm font-semibold text-ink">Phone number *</legend>
   <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
     <label className="grid min-w-0 gap-1 text-sm text-muted">
       Country code
       <select
         value={region}
         onChange={(event) => { setRegion(event.target.value); setPhoneError(""); }}
         aria-describedby={phoneError ? "nda-phone-error" : undefined}
         className="w-full min-w-0 rounded-xl border border-ink/20 bg-white p-3 text-ink"
       >
         <option value="">Select country code</option>
         {callingCountries.map((country) => (
           <option key={country.region} value={country.region}>{country.name} (+{country.code})</option>
         ))}
       </select>
     </label>
     <label className="grid min-w-0 gap-1 text-sm text-muted">
       Number
       <input
         required
         type="tel"
         autoComplete="tel-national"
         maxLength={40}
         value={phone}
         onChange={(event) => { setPhone(event.target.value); setPhoneError(""); }}
         aria-describedby={phoneError ? "nda-phone-error" : undefined}
         className="w-full min-w-0 rounded-xl border border-ink/20 bg-white p-3 text-ink"
         placeholder="Local or full international number"
       />
     </label>
   </div>
   {phoneError && <p id="nda-phone-error" role="alert" className="mt-2 text-sm text-red-700">{phoneError}</p>}
 </fieldset>
 <label className="grid gap-2 text-sm font-semibold text-ink sm:col-span-2">Full address *<textarea required maxLength={500} rows={3} value={address} onChange={e=>setAddress(e.target.value)} className="rounded-xl border border-ink/20 bg-white p-3 text-ink" placeholder="Street address, city, state/province, postal code, country"/></label>
 <div className="flex items-end"><button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white hover:opacity-90"><Download className="h-5 w-5"/> Generate & download NDA (PDF)</button></div>
 </form>
 <p className="mt-4 text-xs leading-relaxed text-muted">Your information is used locally in your browser to create the downloadable PDF. The NDA retains its original PRC governing-law and Xiamen jurisdiction provisions. It is not signed on your behalf; obtain signatures from both parties before relying on it as an executed agreement.</p>
 </section>;
}
