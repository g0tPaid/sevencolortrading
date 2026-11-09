import assert from "node:assert/strict";
import test from "node:test";
import { SOURCING_OFFERS, sourcingOffer } from "@/lib/tracking/sourcing-card";

test("sourcing card offers stay on existing pages and do not invent prices", () => {
  assert.equal(SOURCING_OFFERS.length, 3);
  const ids = new Set(SOURCING_OFFERS.map((offer) => offer.id));
  assert.equal(ids.size, 3);
  for (const offer of SOURCING_OFFERS) {
    assert.match(offer.href, /^\/[a-z0-9-]+$/);
    assert.equal(offer.href.includes("?"), false);
    assert.equal(/\$|guarantee|testimonial|free shipping|lowest price/i.test(offer.detail), false);
    assert.equal(offer.detail.length > 40, true);
    assert.equal(offer.cta.length > 0, true);
  }
  assert.equal(sourcingOffer("home").href, "/contact");
  assert.equal(sourcingOffer("missing").id, "goods");
});
