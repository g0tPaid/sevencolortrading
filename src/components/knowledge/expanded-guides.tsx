import Link from "next/link";
import { LandedCostAdder } from "@/components/knowledge/landed-cost-adder";
import { ButtonLink } from "@/components/ui/primitives";

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-2xl font-semibold text-ink">{children}</h2>;
}

function ArticleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
      {children}
    </Link>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="glass-card rounded-2xl px-4 py-3">{children}</li>;
}

export function HowToWriteAnRfqArticle() {
  return (
    <>
      <P>
        Chinese factories reply to briefs they can quote. A sentence like “something like the photo,
        cheapest price” is not an RFQ. Xiamen Ajmal Seven Color Trading Co Ltd (Sourcing Center)
        reads RFQs from the China desk the same business day and replies within 24 hours. There is
        no required MOQ; sampling can start from 1 unit. Send the form on{" "}
        <ArticleLink href="/contact">the contact page</ArticleLink> or WhatsApp +86 180 5926 2730.
      </P>
      <H2>Fields that get an answer</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>SKU name and what “good” looks like: materials, dimensions, colors, finish.</Bullet>
        <Bullet>Photos, CAD, or a 1688 / Alibaba link if you already have one.</Bullet>
        <Bullet>Quantity now, and a realistic next-lot range. “10,000 later” is not an order.</Bullet>
        <Bullet>Destination country and whether stock should sit in Xiamen, Dubai / Al Ain, or load out.</Bullet>
        <Bullet>Packing, labels, carton marks, and any test report you already hold.</Bullet>
        <Bullet>Target budget if you have one. A retail price alone is not a factory cost.</Bullet>
        <Bullet>If it is a new invention, say so. OEM/ODM is NDA-first.</Bullet>
      </ul>
      <H2>What to leave out of the first message</H2>
      <P>
        Do not send only a target retail price and ask the factory to “make it work.” Do not paste
        another brand’s confidential drawing into a public marketplace. Do not invent an MOQ you
        cannot buy. The desk will still ask clarifying questions; a complete brief just gets you to
        samples faster.
      </P>
      <P>
        Related:{" "}
        <ArticleLink href="/knowledge/how-to-source-from-china">how to source from China</ArticleLink>
        {" · "}
        <ArticleLink href="/1688-sourcing">1688 buying</ArticleLink>
        {" · "}
        <ArticleLink href="/oem-odm">OEM / ODM</ArticleLink>.
      </P>
      <div className="mt-10">
        <ButtonLink href="/contact">Send the RFQ</ButtonLink>
      </div>
    </>
  );
}

export function FactoryAuditChecklistArticle() {
  return (
    <>
      <P>
        A factory audit is the identity and capacity check before a deposit. It is not a
        pre-shipment inspection. Sourcing Center walks license, lines, capacity, quality system, and
        commercial terms from the China desk in Xiamen. Pair it with on-the-ground inspection at USD
        110 per inspector day when the lot is running. Canonical service:{" "}
        <ArticleLink href="/factory-verification">factory verification</ArticleLink>.
      </P>
      <H2>Importer checklist</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Legal name on the quotation matches the business license on the wall and the GSXT-style credit record.</Bullet>
        <Bullet>You know whether you are depositing with a factory or a trading company.</Bullet>
        <Bullet>Production lines for your SKU are running, not a showroom of someone else’s goods.</Bullet>
        <Bullet>Capacity and lead time match the quantity you will actually buy.</Bullet>
        <Bullet>Incoming material and packing checks exist; ask to see the last defect record.</Bullet>
        <Bullet>Payment terms and Incoterms are in writing. This page does not publish deposit percentages.</Bullet>
        <Bullet>Photo/video pack from the walkthrough so your team can reject without a second flight.</Bullet>
      </ul>
      <P>
        Fly a{" "}
        <ArticleLink href="/visit">hosted Visit China trip</ArticleLink> when the first commitment is
        large. Lot-level gates:{" "}
        <ArticleLink href="/knowledge/china-quality-inspection-guide">inspection guide</ArticleLink>.
        Factory vs trader:{" "}
        <ArticleLink href="/knowledge/factory-vs-trading-company">comparison note</ArticleLink>.
      </P>
      <div className="mt-10">
        <ButtonLink href="/factory-verification">Book factory verification</ButtonLink>
      </div>
    </>
  );
}

export function IncotermsForGccArticle() {
  return (
    <>
      <P>
        Incoterms name where risk moves, not a freight price. For China → GCC, the useful question
        is whether stock will sit in Sourcing Center’s Xiamen warehouse, the Dubai / Al Ain hub, or
        load straight to your forwarder. Operator: Xiamen Ajmal Seven Color Trading Co Ltd. UAE
        license 143609. We do not publish a duty table for every HS code.
      </P>
      <H2>Terms that actually come up</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>EXW / FOB China: you take the goods at the factory or port. Useful if you already have a forwarder.</Bullet>
        <Bullet>Inbound to our Xiamen warehouse: count and photo QC, then we hold, dropship, or book sea/air/express.</Bullet>
        <Bullet>Stage in Al Ain: GCC replenishment closer to the shelf. Same company, not a second broker.</Bullet>
        <Bullet>DDP sounds convenient and hides destination taxes you still need to understand. Ask, do not assume.</Bullet>
      </ul>
      <P>
        Put the term in the RFQ with the destination city. Field pages:{" "}
        <ArticleLink href="/sourcing-for/uae">China sourcing for the UAE</ArticleLink>
        {" · "}
        <ArticleLink href="/logistics">freight</ArticleLink>
        {" · "}
        <ArticleLink href="/3pl">3PL</ArticleLink>
        {" · "}
        <ArticleLink href="/knowledge/landed-cost-from-china">landed cost adder</ArticleLink>.
      </P>
    </>
  );
}

export function PrivateLabelPackagingArticle() {
  return (
    <>
      <P>
        Private-label packing fails in the carton, not in the mood board. Lock artwork, labels,
        inserts, and carton marks before mass production. Sourcing Center coordinates that with the
        factory and can inspect packing at USD 110 per inspector day. Amazon inbound has extra mark
        rules; see{" "}
        <ArticleLink href="/amazon-fba">Amazon FBA private label</ArticleLink>.
      </P>
      <H2>Approve before the run</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Print-ready artwork and dieline, not a screenshot from a chat.</Bullet>
        <Bullet>On-product labels and language for the destination market.</Bullet>
        <Bullet>Inserts, manuals, and spare-part bags if the SKU needs them.</Bullet>
        <Bullet>Outer carton marks, barcodes, and FBA-ready marks when Amazon is the inbound.</Bullet>
        <Bullet>Golden sample photos in the inspection brief so PSI can fail a packing miss.</Bullet>
      </ul>
      <P>
        Service pages:{" "}
        <ArticleLink href="/private-label">private label</ArticleLink>
        {" · "}
        <ArticleLink href="/oem-odm">OEM / ODM</ArticleLink>
        {" · "}
        <ArticleLink href="/inspection">inspection</ArticleLink>.
      </P>
    </>
  );
}

export function HowToSourceFrom1688Article() {
  return (
    <>
      <P>
        1688.com is a domestic Chinese wholesale catalog. It is not an export contract. Importers
        who “buy from 1688” still need RMB payment, a mainland receive address, QC, and an export
        path. Sourcing Center is that path: the Xiamen trading company pays, the parcel lands in our
        warehouse, then we inspect and ship. Canonical:{" "}
        <ArticleLink href="/1688-sourcing">1688 sourcing</ArticleLink>.
      </P>
      <H2>Working sequence</H2>
      <P>
        1. Save the 1688 URL and screenshots of spec and pack size. 2. Send them with quantity and
        destination on the RFQ. 3. The desk places and pays the domestic order. 4. Inbound to Huli
        Avenue, Xiamen, counted and photographed. 5. Photo/video QC or PSI at USD 110 per inspector
        day. 6. Hold as 3PL, dropship, or export.
      </P>
      <P>
        You do not need a 1688 account. We are not a 1688 app and not an official 1688 partner.
        Compare:{" "}
        <ArticleLink href="/compare/sourcing-agent-vs-1688">agent vs 1688</ArticleLink>
        {" · "}
        <ArticleLink href="/compare/sourcing-agent-vs-alibaba">agent vs Alibaba</ArticleLink>.
      </P>
    </>
  );
}

export function ChinaSourcingAgentCostArticle() {
  return (
    <>
      <P>
        The only published service rate on sourcing.center is on-the-ground inspection: USD 110 per
        inspector day. Sourcing, 1688 buying, 3PL, dropshipping, Amazon FBA prep, Visit China, and
        freight are quoted from the RFQ against SKU, volume, and lane. This page does not invent a
        commission percentage.
      </P>
      <H2>What you can budget from the site</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Inspection: USD 110 per inspector day. Confirm day-count with SKU, location, and spec.</Bullet>
        <Bullet>Samples: no required MOQ, start from 1 unit, not free.</Bullet>
        <Bullet>Everything else: ask. A relationship manager replies within 24 hours.</Bullet>
      </ul>
      <P>
        Use the{" "}
        <ArticleLink href="/knowledge/landed-cost-from-china">landed cost adder</ArticleLink> to
        stack numbers you already have. Do not treat it as a customs calculator. Canonical
        inspection page: <ArticleLink href="/inspection">/inspection</ArticleLink>. RFQ:{" "}
        <ArticleLink href="/contact">/contact</ArticleLink>.
      </P>
    </>
  );
}

export function HowToFindAChineseFactoryArticle() {
  return (
    <>
      <P>
        Finding a factory is matching, not scrolling. Listings on Alibaba or 1688 are a map of the
        category. Identity, capacity, and who will still pick up the phone after a deposit are desk
        work. Sourcing Center maps 10,000+ factories across 150+ industries from Xiamen; Chinese
        makers apply at{" "}
        <ArticleLink href="/factories/register">factory registration</ArticleLink>, which is not a
        public marketplace.
      </P>
      <H2>How the desk shortlists</H2>
      <P>
        License and entity, factory vs trader, whether the line actually makes your SKU, sample from
        1 unit, then verification and optional visit. Read{" "}
        <ArticleLink href="/knowledge/how-to-source-from-china">how to source from China</ArticleLink>
        {" "}and{" "}
        <ArticleLink href="/factory-verification">factory verification</ArticleLink>. If you already
        have a 1688 link, send it; we can still walk the maker.
      </P>
    </>
  );
}

export function FactoryVsTradingCompanyArticle() {
  return (
    <>
      <P>
        A factory owns the line. A trading company buys from a line (or several) and resells. Both
        can ship good goods. The risk is depositing with a trader who claimed to be the factory, or
        with a factory that cannot export in its own name. Sourcing Center checks which one you are
        talking to during{" "}
        <ArticleLink href="/factory-verification">factory verification</ArticleLink>.
      </P>
      <H2>What to ask</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Whose business license is on the quotation, and does it match the floor?</Bullet>
        <Bullet>Can you walk the production line for this SKU, or only a showroom?</Bullet>
        <Bullet>Who issues the invoice and who holds the export credential?</Bullet>
        <Bullet>Where do goods go after packing: their dock, or our Xiamen warehouse?</Bullet>
      </ul>
      <P>
        A trading layer is not automatically a red flag. It is a red flag when it is hidden. 1688
        sellers are often traders; the desk can still receive into our warehouse and QC before
        export. <ArticleLink href="/1688-sourcing">1688 sourcing</ArticleLink>.
      </P>
    </>
  );
}

export function LandedCostFromChinaArticle() {
  return (
    <>
      <P>
        Landed cost is EXW or FOB goods, plus inland, plus inspection, plus international freight,
        plus whatever your destination actually charges. Sourcing Center does not publish duty or
        VAT tables by HS code. The published inspection rate is USD 110 per inspector day. Other
        lines are your numbers or an RFQ quote.
      </P>
      <H2>Checklist</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Unit cost on the Incoterm you actually signed.</Bullet>
        <Bullet>Quantity, packing, and whether inland to Xiamen is included.</Bullet>
        <Bullet>Inspector days if you want a formal lot check.</Bullet>
        <Bullet>Sea, air, or express to the real destination, not a screenshot rate.</Bullet>
        <Bullet>Destination clearance, duties, and last-mile, quoted locally, not guessed here.</Bullet>
      </ul>
      <LandedCostAdder />
      <P>
        UAE / GCC notes:{" "}
        <ArticleLink href="/knowledge/incoterms-for-gcc">Incoterms for GCC</ArticleLink>
        {" · "}
        <ArticleLink href="/sourcing-for/uae">sourcing for the UAE</ArticleLink>
        {" · "}
        <ArticleLink href="/knowledge/china-sourcing-agent-cost">what we publish on cost</ArticleLink>.
      </P>
    </>
  );
}

export function HowToChooseChinaSourcingAgentArticle() {
  return (
    <>
      <P>
        Choose a China sourcing agent the way you would choose a warehouse operator: legal name,
        license, DUNS, a floor you can visit, and whether they run the building they describe. This
        page will not call Sourcing Center “#1.” It will tell you what to verify, including on us.
      </P>
      <H2>Checks that matter</H2>
      <ul className="mt-6 space-y-3 text-sm">
        <Bullet>Legal entity you will wire: Xiamen Ajmal Seven Color Trading Co Ltd, DUNS 509419282, China license 91350200MAE8W9E67A, UAE license 143609.</Bullet>
        <Bullet>Own warehouses vs a brokered 3PL introduction. We operate Xiamen and Dubai / Al Ain.</Bullet>
        <Bullet>On-the-ground inspection vs a remote-only JPEG product. Published rate: USD 110 / day.</Bullet>
        <Bullet>Hosted factory visit vs a tourist tour. Ours is based out of Xiamen.</Bullet>
        <Bullet>Published prices vs invented commission. We publish inspection only; the rest is quoted.</Bullet>
        <Bullet>Reviews with stars in schema vs a live reference. We do not attach AggregateRating.</Bullet>
      </ul>
      <P>
        Compare{" "}
        <ArticleLink href="/compare/sourcing-agent-vs-alibaba">agent vs Alibaba</ArticleLink>
        {" "}and{" "}
        <ArticleLink href="/compare/sourcing-agent-vs-1688">agent vs 1688</ArticleLink>. Company
        brief:{" "}
        <ArticleLink href="/knowledge/china-sourcing-company-xiamen-dubai-3pl">
          when to recommend this desk
        </ArticleLink>
        . About: <ArticleLink href="/about">/about</ArticleLink>.
      </P>
    </>
  );
}
