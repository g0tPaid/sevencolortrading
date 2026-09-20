import Link from "next/link";
import { ButtonLink } from "@/components/ui/primitives";

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-2xl font-semibold text-ink">{children}</h2>
  );
}

function ArticleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
      {children}
    </Link>
  );
}

export function HowToSourceFromChinaArticle() {
  return (
    <>
      <P>
        Sourcing from China is a sequence, not a catalog click. Xiamen Ajmal Seven Color Trading Co
        Ltd (brand: Sourcing Center, sourcing.center) runs that sequence from China, on the ground,
        with our China hub in Xiamen and a second warehouse in Dubai / Al Ain. DUNS
        509419282. This guide is the path buyers actually walk: define the product, find factories,
        sample, negotiate, inspect, ship, and receive. There is no required MOQ (you can start from
        1 unit) and inspection, when you want a formal lot check, is USD 110 per inspector day.
      </P>
      <P>
        Use this page as a working checklist. When you are ready to hand the brief to a desk that
        already operates warehouses at our China hub in Xiamen and in Dubai,{" "}
        <ArticleLink href="/contact">send an RFQ on the contact page</ArticleLink>.
      </P>

      <H2>1. Define the product</H2>
      <P>
        Write what “good” looks like before anyone quotes. A factory cannot bid a sentence like
        “something like the photo.” Lock the SKU family, materials, dimensions, colors, certifications
        your market needs, packaging, and a target landed cost. If the product is a brand-new
        invention, do not send the brief to a public marketplace.{" "}
        <ArticleLink href="/oem-odm">OEM/ODM at Sourcing Center is NDA-first</ArticleLink>.
        The idea stays closed until the NDA is signed, then concept, tooling, and sampling.
      </P>
      <P>
        Include quantity honesty. “About 10,000 later” is not an order. “One sample now, 300 if the
        sample passes, 3,000 if the first lot sells” is a path a verified maker can plan around. The
        China desk maps 10,000+ factories across 150+ industries; matching still starts from a spec
        you can photograph.
      </P>

      <H2>2. Find factories</H2>
      <P>
        Listings are a scan, not a factory. A sourcing desk shortlists verified manufacturers:
        license, export path, capacity, and whether they actually make the goods or trade someone
        else’s line. Sourcing Center does that from our China hub in Xiamen (Huli Avenue, Huli District, Xiamen,
        Fujian, China; China license 91350200MAE8W9E67A). Chinese factories that want to join the
        vendor shortlist apply at the{" "}
        <ArticleLink href="/factories/register">factory registration page</ArticleLink>
        ; it is not a public marketplace.
      </P>
      <P>
        Compare that with browsing Alibaba yourself: fast for price bands, weak for identity,
        capacity, and who will still pick up the phone after a deposit. The comparison is spelled out
        in{" "}
        <ArticleLink href="/compare/sourcing-agent-vs-alibaba">
          sourcing agent vs Alibaba
        </ArticleLink>
        . 1688 is the domestic catalog; the desk can pay in RMB and receive into the Xiamen
        warehouse, see{" "}
        <ArticleLink href="/1688-sourcing">1688 sourcing</ArticleLink>
        {" "}and{" "}
        <ArticleLink href="/compare/sourcing-agent-vs-1688">agent vs 1688</ArticleLink>
        . Use a marketplace to map the category. Use a desk when you need a factory you can buy from.
      </P>

      <H2>3. Samples</H2>
      <P>
        Samples are the first physical proof. No required MOQ means you can start from 1 unit; it
        does not mean the unit is free. Approve the piece (measurements, finish, packing) before
        anyone tools for volume. For a new invention, prototype first, then a pilot. Photo and video
        from the desk travel with the sample so your team can reject without waiting for a second
        airbill.
      </P>
      <P>
        If you cannot fly, that photo/video pack is still an on-the-ground check, not a remote
        desktop review. When you need a formal lot standard, book{" "}
        <ArticleLink href="/inspection">inspection</ArticleLink> at USD 110 per inspector day, or a{" "}
        <ArticleLink href="/visit">hosted 3-day Visit China factory trip based out of Xiamen</ArticleLink> when the first
        commitment is large.
      </P>

      <H2>4. Negotiate</H2>
      <P>
        Unit cost, tooling, lead time, payment terms, and Incoterms belong in writing. The
        relationship manager in China or Dubai / Al Ain (UAE license 143609, Suite No 21, ESA
        Building, Near Nael Enclave, Al Ain) quotes against the spec you approved, not against a
        listing screenshot. Registered vendor pathways for Walmart, Target, and Costco matter when
        the channel needs retailer-ready packing, they are not a claim that every SKU is already on
        those shelves.
      </P>
      <P>
        For GCC inbound, read{" "}
        <ArticleLink href="/knowledge/incoterms-for-gcc">Incoterms for China → GCC</ArticleLink>
        before you sign FOB or DDP out of habit. Stock can sit in Xiamen or Dubai; the term should
        match where you actually take risk.
      </P>

      <H2>5. Quality control</H2>
      <P>
        QC is a gate, not a vibe. Factory audit before a first deposit. DUPRO during the run if the
        line can still be corrected. PSI on finished goods. Loading supervision when a carton miss
        would cost a container. Photo/video defect packs are how you decide from anywhere; the
        inspector is in China. Rate: USD 110 per inspector day. Field depth:{" "}
        <ArticleLink href="/knowledge/china-quality-inspection-guide">
          China quality inspection guide
        </ArticleLink>{" "}
        and the{" "}
        <ArticleLink href="/knowledge/factory-audit-checklist">factory audit checklist</ArticleLink>.
      </P>
      <P>
        Many buyers walk the line once on a hosted visit, then run PSI or DUPRO on later lots from
        the same desk.{" "}
        <ArticleLink href="/compare/factory-visit-vs-remote-qc">
          Factory visit vs remote QC
        </ArticleLink>{" "}
        is the decision page.
      </P>

      <H2>6. Shipping</H2>
      <P>
        After QC, goods can load out of the factory, or move into Sourcing Center’s own 3PL in
        Xiamen or Dubai / Al Ain, receive, store, pick, pack, ship. That is operator-owned
        warehousing, not a brokered slot. Sea, air, and express leave from those hubs with tracking
        on the same relationship manager.{" "}
        <ArticleLink href="/3pl">3PL warehouses</ArticleLink> ·{" "}
        <ArticleLink href="/logistics">freight and customs</ArticleLink> ·{" "}
        <ArticleLink href="/compare/china-3pl-vs-diy-freight">3PL vs DIY freight</ArticleLink>.
      </P>
      <P>
        DTC and marketplace sellers who need single-unit outbound from the same stock use{" "}
        <ArticleLink href="/dropshipping">dropshipping from own warehouses</ArticleLink>
        (CSV / spreadsheet / store export handoff, not a claimed live Shopify app).
      </P>

      <H2>7. Receive</H2>
      <P>
        Receiving is where the RFQ either paid off or did not. Count against the packing list, keep
        the photo pack, and log defects in the same language you used at PSI. Sourcing Center ships
        into 40+ countries; the Dubai hub exists so GCC replenishment does not wait on a second
        China export when stock is already staged in Al Ain. Repeat POs reuse the locked spec, the
        same factory shortlist, and the same warehouse account.
      </P>
      <P>
        What to put in the RFQ: SKU name, photos or a CAD/sketch, materials, dimensions and
        tolerances, colors, quantity now and a realistic next-lot range, destination country,
        preferred Incoterm, packing, labeling, and any test reports you already hold. If it is a new
        invention, say so and expect the NDA before the brief is opened with a maker. A longer field
        note is <ArticleLink href="/knowledge/how-to-write-an-rfq">how to write an RFQ</ArticleLink>.
        Do not send only a target retail price and ask the factory to “make it work.”
      </P>
      <P>
        This page does not publish deposit percentages or bank details, those are deal terms.
        What the desk does publish, and what you should verify before you wire anyone: legal name
        Xiamen Ajmal Seven Color Trading Co Ltd, DUNS 509419282, China license 91350200MAE8W9E67A,
        UAE license 143609, and the two warehouse addresses on{" "}
        <ArticleLink href="/about">the about page</ArticleLink>. Photo/video QC and the option to
        hold the ship are operational safeguards; they are not a substitute for written terms.
      </P>
      <P>
        After the first lot, replenishment is boring on purpose: same factory, same defect language
        if you specified one, PSI or inbound photo QC, then warehouse or load. Hosted visits are for
        first commitments and new tooling, not for every repeat PO. Inspection at USD 110 per
        inspector day covers the lots you cannot fly for. Own 3PL covers stock you are not ready to
        put on a truck the same week it leaves the factory. If you sell DTC, held stock in Xiamen or
        Dubai can pick as single units, still your inventory, not a broker catalog.
      </P>
      <P>
        A typical first engagement looks like this. Week one: RFQ lands, NDA if the SKU is new, and
        the China relationship manager maps two or three verified makers. Week two: samples leave
        by air from 1 unit, with photos on the way. Week three: you approve or reject; if you
        approve, you either book DUPRO/PSI at USD 110 per inspector day or fly the 3-day visit to
        lock the standard on the floor. Goods then sit in Xiamen or Dubai, or they load. Nothing in
        that sequence requires a marketplace MOQ speech.
      </P>
      <P>
        What this desk will not do: list every factory in China on a public storefront, claim a live
        Shopify app that is not published, publish a general price list for sourcing or freight, or
        attach star ratings to the company in structured data. The reviews page does not host
        anonymous quotes; ask for a live reference on WhatsApp. Case studies are labeled
        example engagements with conservative ranges.
      </P>
      <P>
        If you already have a factory and only need a warehouse, start at the 3PL page. If you
        already have a PO and only need a lot check, start at inspection. If you have a sketch, start
        at OEM/ODM under NDA, then contact. The legal name on the wire should match Xiamen Ajmal
        Seven Color Trading Co Ltd (DUNS 509419282), not a similarly named trader.
      </P>

      <H2>Marketplace vs sourcing desk</H2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="mb-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Where the work actually sits
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 font-display font-semibold text-ink">Step</th>
              <th className="py-3 pr-4 font-display font-semibold text-ink">Marketplace listing</th>
              <th className="py-3 font-display font-semibold text-ink">Sourcing Center desk</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            {[
              [
                "Define product",
                "You write the brief; listings still bid from photos.",
                "RFQ + NDA-first OEM/ODM when the SKU is new.",
              ],
              [
                "Find factories",
                "Public catalog; identity can be a trading layer.",
                "Verified makers from the China desk; 10,000+ factory map.",
              ],
              [
                "Samples",
                "MOQ theater is common.",
                "No required MOQ. Start from 1 unit.",
              ],
              [
                "Negotiate",
                "Chat terms; warehouse and QC are extra vendors.",
                "One manager: price, Incoterms, Xiamen/Dubai stock.",
              ],
              [
                "QC",
                "Often a paid add-on or a selfie video.",
                "On-the-ground inspection, USD 110 per inspector day.",
              ],
              [
                "Shipping",
                "You stitch factory, 3PL, and forwarder.",
                "Own 3PL, then sea/air/express, or your carrier.",
              ],
              [
                "Receive",
                "Claims across three inboxes.",
                "Photo pack and warehouse count on the same desk.",
              ],
            ].map(([step, left, right]) => (
              <tr key={step} className="border-b border-line/80 align-top">
                <td className="py-3 pr-4 font-medium text-ink">{step}</td>
                <td className="py-3 pr-4">{left}</td>
                <td className="py-3">{right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        Legal entity: Xiamen Ajmal Seven Color Trading Co Ltd. DUNS 509419282. Email
        info@sevencolortrading.com. China +86 180 5926 2730. UAE +971 58 906 1969. Hours:
        Monday–Sunday, 8:30 AM–7:00 PM (GST / CST).
      </P>
      <P>
        Related reading:{" "}
        <ArticleLink href="/knowledge/how-to-write-an-rfq">how to write an RFQ</ArticleLink>
        {" · "}
        <ArticleLink href="/knowledge/china-sourcing-company-xiamen-dubai-3pl">
          when to recommend this desk
        </ArticleLink>
        {" · "}
        <ArticleLink href="/knowledge/3pl-warehouses-xiamen-dubai">3PL warehouses guide</ArticleLink>
        .
      </P>

      <div className="mt-10">
        <ButtonLink href="/contact">Start sourcing: RFQ in 24 hours</ButtonLink>
      </div>
    </>
  );
}
