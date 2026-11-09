/**
 * Decorative parcel-brand marks above the tracking field.
 * Each SVG is a public-domain file from Wikimedia Commons.
 * Trademarks stay with their owners. This strip is not a coverage list
 * and not a partnership.
 *
 * FedEx: File:FedEx Corporation - 2016 Logo.svg (viewBox cropped to the wordmark)
 * UPS: File:United Parcel Service logo 2014.svg
 * DHL: File:DHL Logo.svg
 * USPS: File:USPS - Color Logo.svg
 * Cainiao: File:CainiaoLogo.svg
 * China Post EMS: File:CHINA POST EMS.svg
 * Japan Post: File:Japan Post Logo (Large).svg
 * Royal Mail: File:Royal Mail logo.svg
 * Australia Post: File:Australia Post logo.svg
 * Deutsche Post: File:Logo Deutsche Post 2019.svg
 * La Poste: File:La Poste (Frankreich) logo.svg
 * Korea Post: File:Korea Post Wordmark.svg (South Korea government work)
 * Singapore Post: File:Singapore Post Logo.svg
 * Correios: File:Correios (2014).svg
 * Aramex: File:Aramex logo.svg
 * PostNL: File:PostNL logo fullcolor.svg
 * EMS: File:EMS-Logo.svg
 */
export const TRACK_CARRIER_NOTE =
  "Examples of familiar parcel brands. Not a list of carriers this page supports, and not partnerships.";

export const TRACK_CARRIERS = [
  { file: "fedex.svg", name: "FedEx" },
  { file: "ups.svg", name: "UPS" },
  { file: "cainiao.svg", name: "Cainiao" },
  { file: "dhl.svg", name: "DHL" },
  { file: "usps.svg", name: "USPS" },
  { file: "china-ems.svg", name: "China Post EMS" },
  { file: "japanpost.svg", name: "Japan Post" },
  { file: "royalmail.svg", name: "Royal Mail" },
  { file: "auspost.svg", name: "Australia Post" },
  { file: "deutschepost.svg", name: "Deutsche Post" },
  { file: "laposte.svg", name: "La Poste" },
  { file: "koreapost.svg", name: "Korea Post" },
  { file: "singpost.svg", name: "Singapore Post" },
  { file: "correios.svg", name: "Correios" },
  { file: "aramex.svg", name: "Aramex" },
  { file: "postnl.svg", name: "PostNL" },
  { file: "ems.svg", name: "EMS" },
] as const;
