export const BRAND = {
  name: 'Seven Color Trading',
  shortName: 'Seven Color',
  domain: 'sevencolortrading.com',
  tagline: 'Source anything from China with zero hassle.',
  description:
    'End-to-end China sourcing for SMEs and personal buyers. No MOQ, offices in Dubai and China, photos and videos before every shipment.',
  emails: {
    corporate: 'info@sevencolor.online',
    sme: 'info@sevencolortrading.com',
  },
  phones: {
    dubai: '+971589061969',
    china: '+8618059262730',
    india: '+917736667000',
  },
  whatsapp: '+971589061969',
  whatsappUrl: 'https://wa.me/971589061969',
  offices: {
    dubai: {
      label: 'Dubai, UAE',
      lines: [
        'Suite No 21, ESA Building',
        'Near Nael Enclave, Dubai / Al Ain, UAE',
        'License Number — 143609',
      ],
    },
    china: {
      label: 'Xiamen, China',
      lines: [
        'Xiamen Ajmal Seven Color Trading Co Ltd',
        'Huli Avenue, Huli District, Xiamen City, Fujian, China',
        'License Number — 91350200MAE8W9E67A',
      ],
    },
  },
  hours: 'Monday – Sunday · 8:30 AM – 7:00 PM',
  dnbUrl:
    'https://www.dnb.com/business-directory/company-profiles.xiamen_ajmal_seven_color_trading_coltd.afd1292c2cf00d8d263a3b893ebd2599.html',
  stats: [
    { value: '1,000+', label: 'Happy clients' },
    { value: '10+', label: 'Years experience' },
    { value: '500+', label: 'Verified suppliers' },
    { value: '50+', label: 'Countries served' },
  ],
} as const;

export const SPECTRUM = [
  '#E11D48',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#0891B2',
  '#2563EB',
  '#7C3AED',
] as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/quote', label: 'Get Quote' },
  { href: '/contact', label: 'Contact' },
] as const;

export const HOW_IT_WORKS = [
  {
    step: '01',
    time: '5 min',
    title: 'Share requirements',
    body: 'Tell us the product, specs, quantity, and your target budget.',
  },
  {
    step: '02',
    time: '1–2 days',
    title: 'We source & negotiate',
    body: 'Our team finds verified suppliers, negotiates pricing, and locks quality standards.',
  },
  {
    step: '03',
    time: '1–3 days',
    title: 'Quality verification',
    body: 'You approve photos and videos. We inspect before anything ships.',
  },
  {
    step: '04',
    time: '7–14 days',
    title: 'Shipping & delivery',
    body: 'Freight and customs arranged. Track the shipment to your door.',
  },
] as const;

export const CATEGORIES = [
  {
    title: 'Electronics & gadgets',
    body: 'Consumer electronics, accessories, and smart devices.',
  },
  {
    title: 'Home & lifestyle',
    body: 'Furniture, décor, kitchenware, and household products.',
  },
  {
    title: 'Industrial & machinery',
    body: 'Heavy equipment, industrial tools, and machinery parts.',
  },
  {
    title: 'Fashion & accessories',
    body: 'Apparel, footwear, bags, and fashion accessories.',
  },
  {
    title: 'Construction & steel',
    body: 'Building materials, steel products, and construction supplies.',
  },
  {
    title: 'Custom products',
    body: 'Special orders and custom manufacturing requirements.',
  },
] as const;

export const SERVICES = [
  {
    title: 'Personal shopper service',
    body: 'Buy one unit or ten thousand — we shop, verify, and ship like your team on the ground in China.',
  },
  {
    title: 'Product sourcing',
    body: 'Find and negotiate with verified manufacturers for any category, with transparent landed pricing.',
  },
  {
    title: 'Quality inspection',
    body: 'Photos, videos, and inspection before every shipment so surprises stay in the factory — not at your door.',
  },
  {
    title: 'Shipping & logistics',
    body: 'International freight and customs clearance from China and Dubai warehouses to your destination.',
  },
] as const;

export const WHY_US = [
  'No minimum order quantity — buy 1 unit or 10,000',
  'Offices and warehouses in Dubai and China',
  'Pictures and videos of products before shipping',
  'Personal relationship manager for every client',
  'Direct access to Chinese manufacturers and suppliers',
  'Quality inspection before every shipment',
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'Seven Color made buying from China so easy. No minimum orders and they sent me pictures before shipping. Perfect service.',
    name: 'Michael Chan',
    role: 'E-commerce business owner',
    place: 'USA',
  },
  {
    quote:
      'Their personal relationship manager in Dubai was amazing. Got my products from China to UAE in 10 days with full tracking.',
    name: 'Ahmed Al-Rashid',
    role: 'Retail store owner',
    place: 'UAE',
  },
  {
    quote:
      'Best sourcing service. They found exactly what I needed, sent videos of the factory, and handled everything.',
    name: 'Sophie Martinez',
    role: 'Fashion brand founder',
    place: 'Spain',
  },
] as const;

export function waUrl(message: string) {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
