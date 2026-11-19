"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, ImageIcon, Link2, Package, Search, ShoppingCart, ShieldCheck, Truck, X } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { RfqForm } from "@/components/home/rfq-form";
import { formatOfferPrice, parseOfferId, type CatalogOffer, type CatalogResult } from "@/lib/catalog1688/model";
import { whatsappHref } from "@/lib/whatsapp";

type Mode = "keyword" | "offer" | "image";
type Currency = "CNY" | "USD" | "AED";
type CartItem = { offer: CatalogOffer; quantity: number };
type Sort = "" | "price-asc" | "price-desc" | "sales-desc";

const categories = [
  { label: "Furniture", term: "furniture" }, { label: "Home & kitchen", term: "home kitchen accessories" },
  { label: "Electronics", term: "consumer electronics" }, { label: "Fashion", term: "clothing" },
  { label: "Packaging", term: "custom packaging" }, { label: "Industrial", term: "industrial tools" },
  { label: "Beauty", term: "beauty accessories" }, { label: "Office supplies", term: "office supplies" },
];

const modes = [{ value: "keyword", label: "Keyword", icon: Search }, { value: "offer", label: "1688 link", icon: Link2 }, { value: "image", label: "Search by image", icon: Camera }] as const;

async function compressPhoto(file: File) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 10_000_000) throw new Error("Choose a JPEG, PNG or WebP image under 10 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    for (const maxSide of [1000, 750, 500]) {
      const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not prepare this image.");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.86, 0.7, 0.5]) {
        const output = canvas.toDataURL("image/jpeg", quality).split(",")[1];
        if (output && output.length <= 400_000) return output;
      }
    }
    throw new Error("This image is too large. Try a smaller photo.");
  } finally { bitmap.close(); }
}

function OfferCard({ offer, currency, result, inCart, onAdd }: { offer: CatalogOffer; currency: Currency; result: CatalogResult; inCart: boolean; onAdd: () => void }) {
  const converted = formatOfferPrice(offer.priceCny, currency, result.rates);
  const cny = formatOfferPrice(offer.priceCny, "CNY", result.rates);
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition hover:shadow-lg">
    <div className="relative aspect-square overflow-hidden bg-canvas">
      {offer.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={offer.image} alt={offer.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain transition group-hover:scale-[1.025]" onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
      ) : <div className="grid h-full place-items-center text-muted"><ImageIcon size={34} /></div>}
      {offer.singleUnit && <span className="absolute left-2 top-2 rounded-full bg-paper px-2 py-1 text-[10px] font-semibold text-ink">Single unit</span>}
    </div>
    <div className="flex flex-1 flex-col p-3 sm:p-4">
      <p className="line-clamp-2 text-sm font-medium leading-snug text-ink" title={offer.title}>{offer.title}</p>
      {offer.originalTitle && <p className="mt-1 line-clamp-1 text-xs text-muted" lang="zh">{offer.originalTitle}</p>}
      <p className="mt-3 text-xl font-semibold text-accent">{converted || cny || "Price on request"}</p>
      {currency !== "CNY" && converted && cny && <p className="text-xs text-muted">Est. {cny} supplier price</p>}
      <p className="mt-1 text-xs text-muted">{offer.moq ? `MOQ ${offer.moq.toLocaleString()} units` : "MOQ to confirm"}{offer.monthlySold !== undefined ? ` · ${offer.monthlySold.toLocaleString()} sold/month (1688)` : ""}</p>
      <div className="mt-auto pt-4">
        <button type="button" onClick={onAdd} className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2.5 text-xs font-semibold text-accent hover:bg-accent hover:text-white"><ShoppingCart size={15} />{inCart ? "In quote cart" : "Add to quote"}</button>
        <a href={offer.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-between gap-1 text-[11px] text-muted hover:text-accent"><span>1688 ID {offer.id}</span><ArrowUpRight size={13} /></a>
      </div>
    </div>
  </article>;
}

export function Marketplace1688({ connected }: { connected: boolean }) {
  const [mode, setMode] = useState<Mode>("keyword");
  const [query, setQuery] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [currency, setCurrency] = useState<Currency>("CNY");
  const [sort, setSort] = useState<Sort>("");
  const [result, setResult] = useState<CatalogResult | null>(null);
  const [resultQuery, setResultQuery] = useState("");
  const [resultMode, setResultMode] = useState<Mode>("keyword");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quoteSeed, setQuoteSeed] = useState<{ description: string; version: number } | null>(null);
  const [notice, setNotice] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteVersion = useRef(0);
  useEffect(() => () => requestRef.current?.abort(), []);

  function resetMode(next: Mode) {
    requestRef.current?.abort();
    setLoading(false);
    setMode(next); setQuery(""); setResult(null); setStatus(""); setImage(null); setConsent(false);
  }

  async function search(nextQuery = query, page = 1, nextSort = sort) {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus(""); setResult(null);
    const text = nextQuery.trim();
    if (mode === "offer" && !parseOfferId(text)) { setStatus("Paste a complete detail.1688.com product link or numeric offer ID. Short links can be sent through the sourcing request instead."); setLoading(false); return; }
    if (mode === "keyword" && text.length < 2) { setStatus("Enter a product keyword to search."); setLoading(false); return; }
    if (mode === "image" && (!image || !consent)) { setStatus("Choose a product image and confirm that you want to send it to 1688."); setLoading(false); return; }
    if (!connected) { setStatus("Direct 1688 catalog access is pending. Our sourcing team can still find this product and verify its current price for you."); setLoading(false); return; }
    setLoading(true);
    try {
      const url = new URLSearchParams({ mode, q: text, page: String(page), sort: nextSort });
      const response = mode === "image" && image ? await fetch("/api/1688/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: await compressPhoto(image), consent }), signal: controller.signal }) : await fetch(`/api/1688/catalog?${url}`, { signal: controller.signal });
      const body = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok || body.ok !== true) { setStatus(body.message || "Unable to reach the 1688 catalog. Request a quote instead."); return; }
      setResult(body as CatalogResult); setResultMode(mode); setResultQuery(mode === "image" ? image?.name || "Product photo" : text);
      if (!body.offers?.length) setStatus("No matching offers returned. Try a different keyword or send your brief to the sourcing desk.");
    } catch (error) {
      if (!controller.signal.aborted) setStatus(error instanceof Error && mode === "image" ? error.message : "The catalog is temporarily unavailable. Please try again or request a quote.");
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }

  function onSearch(e: FormEvent) { e.preventDefault(); void search(); }
  function addOffer(offer: CatalogOffer) {
    if (cart.some(row => row.offer.id === offer.id)) { setNotice("This product is already in your quote cart."); return; }
    if (cart.length >= 12) { setNotice("Your quote cart holds up to 12 products. Submit this request before starting another."); return; }
    setCart(previous => [...previous, { offer, quantity: offer.moq ?? 1 }]); setNotice(`${offer.title.slice(0, 70)} added to the quote cart.`);
  }

  function openQuote() {
    const context = cart.length ? cart.map(({ offer, quantity }, index) => `${index + 1}. ${offer.title.slice(0, 150)}\n1688 ID ${offer.id} | ${offer.url}\nRequested quantity: ${quantity}`).join("\n\n") : `${mode === "offer" ? "1688 link or ID" : "Product to source"}: ${query.trim() || (image ? image.name : "Please describe the product")}`;
    setQuoteSeed({ description: `1688 sourcing request\n${context}\n\nAdditional specifications / destination: `, version: ++quoteVersion.current });
    setTimeout(() => quoteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return <>
    <section className="relative overflow-hidden border-b border-line bg-paper pt-28 pb-12 sm:pt-36 sm:pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 mission-grid opacity-60" />
      <Container className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-muted"><span className="size-2 rounded-full bg-emerald-500" /> China sourcing desk · Online requests</div>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
          <div><p className="section-kicker">1688 marketplace</p><h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">Find products in China.<br /><span className="text-accent">Source with confidence.</span></h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Discover wholesale offers, compare available supplier prices and send selected products to our Xiamen team for a verified sourcing quote.</p></div>
          <div className="rounded-2xl border border-line bg-canvas/80 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-muted">How it works</p><ul className="mt-3 space-y-3 text-sm text-ink"><li className="flex items-center gap-2"><Search className="shrink-0 text-accent" size={17} /> Find your product</li><li className="flex items-center gap-2"><ShieldCheck className="shrink-0 text-accent" size={17} /> We verify price & supplier</li><li className="flex items-center gap-2"><Truck className="shrink-0 text-accent" size={17} /> We arrange QC & shipping</li></ul></div>
        </div>
        <div className="mt-9 rounded-[1.5rem] border border-line bg-paper p-3 shadow-lg sm:p-5">
          <div role="group" aria-label="Search type" className="flex flex-wrap gap-2">{modes.map(({ value, label, icon: Icon }) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => resetMode(value)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm ${mode === value ? "bg-accent text-white" : "bg-canvas text-muted hover:text-ink"}`}><Icon size={15} />{label}</button>)}</div>
          <form onSubmit={onSearch} className="mt-4">
            {mode === "image" ? <div className="rounded-xl border border-dashed border-line bg-canvas p-4"><label className="flex flex-col gap-2 text-sm font-medium text-ink">Choose a product photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setImage(e.target.files?.[0] ?? null)} className="mt-1 w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-paper file:px-3 file:py-2 file:text-ink" /></label><label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 accent-accent" /> I agree to send this product image to 1688 for a match. Do not upload personal or confidential photos.</label></div> : <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-1"><Search className="shrink-0 text-muted" size={20} /><input name="q" aria-label={mode === "offer" ? "1688 product link or offer ID" : "Search 1688 products"} autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} maxLength={mode === "keyword" ? 100 : 500} placeholder={mode === "offer" ? "Paste a full 1688 product link or ID" : "Search products, e.g. office chair, packaging, LED lamp…"} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-none sm:text-base" /></div>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted">{connected ? "Supplier catalog · Availability and final price subject to confirmation" : "Live catalog connection pending · Our desk can source products now"}</span><button disabled={loading} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"><Search size={17} />{loading ? "Searching…" : "Find products"}</button></div>
          </form>
          {mode === "keyword" && <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3"><span className="self-center text-xs text-muted">Explore:</span>{categories.map(cat => <button key={cat.term} type="button" onClick={() => { setQuery(cat.term); void search(cat.term); }} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink transition hover:border-accent/50 hover:text-accent">{cat.label}</button>)}</div>}
        </div>
      </Container>
    </section>
    <Container className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start sm:py-14">
      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Discover offers</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{result ? `${result.offers.length} products · ${resultQuery}` : "Sourcing catalog"}</h2></div><div className="flex flex-wrap gap-2"><label className="text-xs text-muted"><span className="sr-only">Currency</span><select aria-label="Currency" value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="rounded-lg border border-line bg-paper px-3 py-2 text-ink"><option value="CNY">CNY ¥</option><option value="USD">USD $</option><option value="AED">AED د.إ</option></select></label>{connected && resultMode === "keyword" && <label className="text-xs text-muted"><span className="sr-only">Sort results</span><select aria-label="Sort results" value={sort} onChange={e => { const next = e.target.value as Sort; setSort(next); if (result) void search(resultQuery, 1, next); }} className="rounded-lg border border-line bg-paper px-3 py-2 text-ink"><option value="">Relevance</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="sales-desc">Monthly sales</option></select></label>}</div></div>
        <div aria-live="polite" className="mt-4">
          {loading && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl border border-line bg-paper" />)}</div>}
          {!loading && result && result.offers.length > 0 && <><div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">{result.offers.map(offer => <OfferCard key={offer.id} offer={offer} currency={currency} result={result} inCart={cart.some(row => row.offer.id === offer.id)} onAdd={() => addOffer(offer)} />)}</div><p className="mt-4 text-xs leading-relaxed text-muted">Supplier prices retrieved {new Date(result.fetchedAt).toLocaleString()}. {currency !== "CNY" ? (result.rates[currency] ? `Converted with an indicative ${currency} reference rate dated ${result.rates[currency]?.date}. ` : "Conversion unavailable; showing CNY. ") : ""} Price excludes shipping, sourcing fees, duties and inspection. We confirm SKU, quantity-tier pricing and availability before any purchase.</p>{resultMode === "keyword" && <div className="mt-5 flex items-center justify-center gap-3"><button type="button" disabled={result.page <= 1} onClick={() => void search(resultQuery, result.page - 1)} className="rounded-full border border-line bg-paper p-2 disabled:opacity-30" aria-label="Previous page"><ChevronLeft size={20} /></button><span className="text-sm text-muted">Page {result.page}</span><button type="button" disabled={!result.hasMore} onClick={() => void search(resultQuery, result.page + 1)} className="rounded-full border border-line bg-paper p-2 disabled:opacity-30" aria-label="Next page"><ChevronRight size={20} /></button></div>}</>}
          {!loading && (!result || result.offers.length === 0) && <div className="rounded-2xl border border-line bg-paper p-7 text-center shadow-sm sm:p-10"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent"><Package size={27} /></div><h3 className="mt-4 font-display text-xl font-semibold text-ink">{status ? "Let's find your product" : connected ? "Start with a search" : "Find your product with our China desk"}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">{status || (connected ? "Search using a keyword, full product link or photo to see matching 1688 offers." : "Live supplier listings will appear when approved API access is connected. For now, send any 1688 link, product idea or photo and we'll verify supplier options, availability and pricing.")}</p><div className="mt-5 flex flex-wrap justify-center gap-2"><button type="button" onClick={openQuote} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">Request a sourcing quote</button><a href="https://www.1688.com/" rel="noopener noreferrer" target="_blank" className="inline-flex items-center gap-1 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:text-accent">Browse 1688 <ArrowUpRight size={14} /></a></div></div>}
        </div>
      </div>
      <aside className="rounded-2xl border border-line bg-paper p-5 shadow-sm lg:sticky lg:top-24"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><ShoppingCart className="text-accent" size={21} /><h2 className="font-display text-xl font-semibold text-ink">Quote cart</h2></div><span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">{cart.length}</span></div><p className="mt-2 text-xs leading-relaxed text-muted">Save products and quantities to one request. No payment is taken here.</p>{notice && <p role="status" className="mt-2 text-xs text-accent">{notice}</p>}
        {cart.length ? <div className="mt-4 max-h-[400px] space-y-3 overflow-y-auto">{cart.map(({ offer, quantity }) => <div key={offer.id} className="relative rounded-xl border border-line p-3"><button type="button" className="absolute right-2 top-2 text-muted hover:text-accent" aria-label={`Remove ${offer.title}`} onClick={() => setCart(prev => prev.filter(row => row.offer.id !== offer.id))}><X size={16} /></button><p className="pr-5 text-xs font-medium text-ink">{offer.title}</p><label className="mt-2 flex items-center gap-2 text-xs text-muted">Qty <input type="number" min={1} max={100000} value={quantity} onChange={e => setCart(prev => prev.map(row => row.offer.id === offer.id ? { ...row, quantity: Math.max(1, Math.min(100000, Math.floor(Number(e.target.value)) || 1)) } : row))} className="w-20 rounded-md border border-line bg-canvas px-2 py-1 text-ink" /></label></div>)}</div> : <p className="mt-5 rounded-xl bg-canvas p-4 text-center text-xs text-muted">Your quote cart is empty. Add a catalog item or start a custom sourcing request.</p>}
        <button type="button" onClick={openQuote} className="mt-5 w-full rounded-xl bg-ink px-3 py-3 text-sm font-semibold text-paper hover:opacity-90">{cart.length ? "Request quote for cart" : "Start sourcing request"}</button><Link href="/1688-sourcing" className="mt-3 block text-center text-xs font-medium text-accent">Learn how our 1688 buying service works</Link>
      </aside>
      {quoteSeed && <div ref={quoteRef} className="scroll-mt-28 lg:col-span-2"><RfqForm key={quoteSeed.version} sourcePath="/1688" defaultDescription={quoteSeed.description} /><a className="mt-4 inline-flex rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink" href={whatsappHref(quoteSeed.description)} target="_blank" rel="noopener noreferrer">Send the product brief on WhatsApp <ArrowUpRight size={15} /></a></div>}
    </Container>
    <Container className="pb-12"><div className="rounded-2xl border border-line bg-paper p-5 text-sm leading-relaxed text-muted"><strong className="text-ink">Independent sourcing desk.</strong> Sourcing Center is not 1688 and does not represent itself as an official partner. Available listings originate from the 1688 catalog when connected; we independently confirm quotations, shipping, product compliance and supplier details before orders.</div></Container>
  </>;
}

