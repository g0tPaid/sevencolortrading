export const WAREHOUSE_NAME = 'Sourcing Center - Xiamen';
export const WAREHOUSE_ADDRESS = {
  address1: 'No. 79, Huli Street',
  address2: 'Huli District',
  city: 'Xiamen',
  provinceCode: 'FJ',
  countryCode: 'CN',
  zip: '361000',
} as const;

export function warehouseAddressMatches(address: Record<string, string | null> | null | undefined) {
  return Boolean(address && Object.entries(WAREHOUSE_ADDRESS).every(([key, value]) => address[key]?.trim().toLowerCase() === value.toLowerCase()));
}
