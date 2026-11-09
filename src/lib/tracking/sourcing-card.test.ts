import assert from "node:assert/strict";
import test from "node:test";
import { SOURCING_OFFERS, sourcingOffer } from "@/lib/tracking/sourcing-card";

test("sourcing card offers are labels only, with no description or call to action", () => {
  assert.equal(SOURCING_OFFERS.length, 3);
  const ids = new Set(SOURCING_OFFERS.map((offer) => offer.id));
  assert.equal(ids.size, 3);
  const serialized = JSON.stringify(SOURCING_OFFERS);
  assert.equal(serialized.includes("We pay 1688 in RMB, receive into our Xiamen warehouse, then QC and export."), false);
  assert.equal(/detail|description|warehouse|furniture|OEM|ODM|Xiamen/i.test(serialized), false);
  for (const offer of SOURCING_OFFERS) {
    assert.equal("detail" in offer, false);
    assert.equal("description" in offer, false);
    assert.equal("href" in offer, false);
    assert.equal("cta" in offer, false);
    assert.equal(offer.label.length > 0, true);
  }
  assert.equal(sourcingOffer("home").label, "Home");
  assert.equal(sourcingOffer("missing").id, "goods");
});
