import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { formatOfferPrice, parseOfferId } from "./model";
import { extractOffers, normalizeOffer, safeImage, sign1688 } from "./provider";

test("accepts only canonical 1688 offer links and IDs", () => {
  assert.equal(parseOfferId("https://detail.1688.com/offer/123456789.html?foo=1"), "123456789");
  assert.equal(parseOfferId("123456789"), "123456789");
  assert.equal(parseOfferId("https://detail.1688.com.example.com/offer/123456789.html"), null);
  assert.equal(parseOfferId("http://detail.1688.com/offer/123456789.html"), null);
});

test("normalizes actual supplier values, never inventing price or sales", () => {
  const raw = { offerId: "123456789", subject: "产品", subjectTrans: "Product", imageUrl: "//cbu01.alicdn.com/a.jpg", priceInfo: { price: "5.50-8.9" }, minOrderQuantity: 20, monthSold: 0 };
  const offer = normalizeOffer(raw)!;
  assert.equal(offer.title, "Product");
  assert.deepEqual(offer.priceCny, { min: 5.5, max: 8.9 });
  assert.equal(offer.moq, 20);
  assert.equal(offer.monthlySold, 0);
  assert.equal(normalizeOffer({ offerId: "123456789", subject: "Product" })?.priceCny, undefined);
  assert.equal(safeImage("https://alicdn.com.example.com/a.jpg"), undefined);
  assert.equal(extractOffers({ result: { errorCode: "0", offerList: [raw, raw] } }).length, 1);
  assert.deepEqual(extractOffers({ result: { offerList: [] } }), []);
  assert.throws(() => extractOffers({ result: { errorCode: "DENIED" } }));
});

test("signs parameters in sorted order and labels converted pricing", () => {
  const expected = createHmac("sha1", "test-secret").update("param2/1/test/a1z2").digest("hex").toUpperCase();
  assert.equal(sign1688("param2/1/test/", { z: "2", a: "1", _aop_signature: "ignore" }, "test-secret"), expected);
  assert.equal(formatOfferPrice({ min: 10, max: 10 }, "USD", { USD: { rate: 0.14, date: "2026-11-19" } }), "$1.40");
  assert.equal(formatOfferPrice({ min: 10, max: 10 }, "AED", {}), null);
});

