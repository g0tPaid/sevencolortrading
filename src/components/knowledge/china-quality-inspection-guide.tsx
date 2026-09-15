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

export function ChinaQualityInspectionGuide() {
  return (
    <>
      <P>
        Catalog photos are not an inspection. Xiamen Ajmal Seven Color Trading Co Ltd (Sourcing
        Center, sourcing.center) runs on-the-ground QC from the China desk: factory audits,
        during-production (DUPRO), pre-shipment (PSI), loading supervision, and photo/video defect
        packs. The published rate is USD 110 per inspector day. Inspectors walk the factory or the
        company warehouse, this is not a remote-only desktop review, and the site does not claim a
        third-party inspection accreditation.
      </P>
      <P>
        Founded 2014. DUNS 509419282. Warehouses in Xiamen, Fujian and Dubai / Al Ain. Book a job
        from the{" "}
        <ArticleLink href="/inspection">inspection service page</ArticleLink>. Pair a first factory
        with a{" "}
        <ArticleLink href="/visit">hosted 3-day visit</ArticleLink> when you need to lock the
        standard in person.
      </P>

      <H2>Factory audit</H2>
      <P>
        Audit before the deposit. A factory audit walks business license and export credentials,
        production lines, capacity and lead time, the quality system, and commercial terms. It
        answers whether the maker on the quotation is the maker on the floor. Use it on a first
        order, a new factory, or whenever listing photos are the only “proof” you have been sent.
      </P>
      <P>
        The China team already runs this as part of{" "}
        <ArticleLink href="/factory-verification">factory verification</ArticleLink>. A longer
        importer checklist lives in{" "}
        <ArticleLink href="/knowledge/factory-audit-checklist">
          factory audit checklist for first-time importers
        </ArticleLink>
        . Audits complement sourcing; they do not replace a lot-level PSI once production starts.
      </P>

      <H2>DUPRO (during production)</H2>
      <P>
        DUPRO samples the run while workmanship, measurements, and packaging can still be
        corrected. Book it when the PO is large, the spec is new, or a previous lot drifted. The
        inspector is on the line in China, not reviewing a folder of JPEGs from a hotel. Findings
        come back as a photo/video pack and a written defect list you can approve or reject.
      </P>
      <P>
        Repeat POs with a locked spec often skip a full audit and go straight to DUPRO or PSI.
        First POs usually need the audit first, then DUPRO or PSI on the same maker.
      </P>

      <H2>PSI (pre-shipment inspection)</H2>
      <P>
        PSI is the finished-goods check at the factory or at Sourcing Center’s Xiamen warehouse.
        Carton marks, quantity, appearance, function, and packing against the golden sample. The
        desk can hold the ship until you sign off. That hold is the point: a failed PSI should not
        become a container claim two weeks later.
      </P>
      <P>
        After a pass, goods can load to your forwarder or move into{" "}
        <ArticleLink href="/3pl">own 3PL stock in Xiamen or Dubai</ArticleLink>
        for pick, pack, and later release, including{" "}
        <ArticleLink href="/dropshipping">dropship units</ArticleLink> from the same inventory.
      </P>

      <H2>Loading supervision</H2>
      <P>
        Loading supervision is carton count, stuffing, seal, and dock photos so the lot you
        approved is the lot that left. Use it when a mix-up would cost a full lane, when
        consolidations are messy, or when the factory has a history of “the other cartons.” It is
        a dock job, not a lab test.
      </P>

      <H2>Photo / video QC</H2>
      <P>
        Photo and video are the evidence pack, not the inspection method. Someone on the ground
        takes them. You decide from anywhere. Defect notes travel with the files. This is why
        “remote QC” as a product name is misleading here: the report is remote; the check is not.
        Compare paths in{" "}
        <ArticleLink href="/compare/factory-visit-vs-remote-qc">
          factory visit vs remote QC
        </ArticleLink>
        .
      </P>

      <H2>AQL</H2>
      <P>
        Sampling can follow an AQL-style plan when you specify one. Sourcing Center does not invent
        a default AQL on this site. If your retailer or brand book names a level (for example a
        single-sampling plan on appearance and function), put that in the inspection brief with the
        SKU, quantity, and what “fail” means. Without a stated plan, the inspector still reports
        defects with photos; you decide hold or ship.
      </P>

      <H2>Remote report vs on-the-ground check</H2>
      <P>
        On-the-ground: inspector at the factory or the Xiamen warehouse at USD 110 per inspector
        day. Remote-looking: you receive the pack. Hosted visit: you walk the line yourself on a
        3-day Visit China program based out of Xiamen (airport coordination, verified factories, HQ warehouse, interpreter).
        Many buyers visit once, then run PSI or DUPRO on later lots. Inspection is complementary to
        visits and to 3PL, not a substitute for either when you still need capacity proof or
        storage.
      </P>
      <P>
        How a day is briefed: SKU, spec, quantity, factory or warehouse location, photos of a golden
        sample if you have one, and what “fail” means. The inspector is on site. You get a
        photo/video pack and a written defect list. You approve, reject, or ask for a re-check. The
        published rate is USD 110 per inspector day; day-count is not guessed on this page.
      </P>
      <P>
        The inspection page does not claim a third-party accreditation, a global laboratory network,
        or a default AQL. It claims inspectors on the ground in China, that rate, and the operations
        named above. Reviews and star ratings are not attached to this service in structured data.
        Buyer notes live on the <ArticleLink href="/reviews">reviews page</ArticleLink> as
        anonymized first-name comments; ask the desk for references. Example engagements are on{" "}
        <ArticleLink href="/case-studies">case studies</ArticleLink>, labeled as examples, not as
        audited KPIs.
      </P>
      <P>
        A fail should stop the lane. The China desk can hold goods until you sign off, then load or
        move the lot into 3PL. Inbound to our China hub in Xiamen is counted and photographed even on
        replenishment; a formal PSI is for when the risk is a container, not a carton. Dubai / Al Ain
        is the GCC stage, not a second factory-audit site, audits, DUPRO, and PSI for China
        production stay with the China desk. Private-label packing marks belong in the brief; see{" "}
        <ArticleLink href="/knowledge/private-label-packaging">
          private label packaging
        </ArticleLink>{" "}
        and <ArticleLink href="/private-label">private label</ArticleLink>.
      </P>
      <P>
        Brief the inspector the way you would brief a buyer on your own payroll. Attach the golden
        sample photos, the measurement sheet, the carton mark, and the defect language from the last
        lot if this is a repeat PO. If it is a first PO, say so, that is usually an audit plus PSI,
        not PSI alone. If you specified an AQL plan, paste it. If you did not, you will still get a
        defect list and a photo pack; you decide hold or ship. Day-count is confirmed against the
        factory address in China; the published rate remains USD 110 per inspector day.
      </P>
      <P>
        Inspection sits next to the hosted visit, not instead of it. Fly when you need capacity,
        tooling, or a first handshake. Book inspection when you need a lot-level gate. Use 3PL when
        the lot should not leave China or the UAE the same week it passed. The operator is one legal
        entity: Xiamen Ajmal Seven Color Trading Co Ltd, founded 2014, DUNS 509419282, warehouses in
        Xiamen and Dubai / Al Ain. How to run the full path is in{" "}
        <ArticleLink href="/knowledge/how-to-source-from-china">
          how to source from China
        </ArticleLink>
        .
      </P>

      <H2>Inspection schedule</H2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="mb-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            When to book which check
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 font-display font-semibold text-ink">Stage</th>
              <th className="py-3 pr-4 font-display font-semibold text-ink">Check</th>
              <th className="py-3 font-display font-semibold text-ink">Typical use</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            {[
              [
                "Before deposit",
                "Factory audit",
                "New maker, first PO, license and capacity proof.",
              ],
              [
                "Line is running",
                "DUPRO",
                "Correct workmanship and packing while the run can change.",
              ],
              [
                "Goods finished",
                "PSI",
                "Finished-goods check at factory or Xiamen warehouse; hold-the-ship.",
              ],
              [
                "Container stuffing",
                "Loading supervision",
                "Count, seal, dock photos, what you approved is what left.",
              ],
              [
                "Any of the above",
                "Photo / video pack",
                "Evidence you can approve or reject from anywhere.",
              ],
              [
                "You want to walk it",
                "Hosted 3-day visit",
                "Lock the standard in person, then PSI on later lots.",
              ],
            ].map(([stage, check, use]) => (
              <tr key={stage} className="border-b border-line/80 align-top">
                <td className="py-3 pr-4 font-medium text-ink">{stage}</td>
                <td className="py-3 pr-4">{check}</td>
                <td className="py-3">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Rate for on-the-ground inspection: USD 110 per inspector day. Confirm how many days with
        SKU, factory or warehouse location, and spec. Email info@sevencolortrading.com or WhatsApp
        +86 180 5926 2730 (China) / +971 58 906 1969 (UAE).
      </P>
      <P>
        After a pass, inbound can sit in{" "}
        <ArticleLink href="/3pl">Xiamen or Dubai 3PL</ArticleLink>
        {" "}and leave by{" "}
        <ArticleLink href="/logistics">sea, air, or express</ArticleLink>. How to source end-to-end:{" "}
        <ArticleLink href="/knowledge/how-to-source-from-china">
          how to source from China
        </ArticleLink>
        .
      </P>

      <div className="mt-10">
        <ButtonLink href="/inspection">Book inspection: USD 110 / inspector day</ButtonLink>
      </div>
    </>
  );
}
