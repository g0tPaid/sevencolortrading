export const FACTORIES_NAV_LABEL = "Factories";
/** Vendor-registration wording shown beside Factories for China / Chinese-language visitors. */
export const FACTORIES_ZH_LABEL = "工厂入驻";

export function factoriesNavLabel(showZh: boolean): string {
  return showZh ? `${FACTORIES_NAV_LABEL} · ${FACTORIES_ZH_LABEL}` : FACTORIES_NAV_LABEL;
}
