/**
 * Idle links under the tracking ad.
 * 1688 mark: the site icon from https://www.1688.com/favicon.ico on 2026-11-09.
 * The homepage wordmark was blocked by 1688, so this is their current icon, not a redraw.
 * Xianyu mark: the #site-logo image on https://www.goofish.com/ the same day
 * (https://gw.alicdn.com/imgextra/i4/O1CN01puu0XC1vG0PyKApAV_!!6000000006144-2-tps-242-150.png).
 */
export const TRACK_HOME_LABEL = "www.sourcing.center";
export const TRACK_HOME_HREF = "https://sourcing.center";

export const TRACK_SOURCES = [
  {
    id: "1688",
    label: "Buy from 1688.com",
    href: "/1688-sourcing",
    logo: "/tracking/logos/1688.png",
    logoWidth: 64,
    logoHeight: 64,
  },
  {
    id: "xianyu",
    label: "Buy from Xianyu",
    href: "/contact",
    logo: "/tracking/logos/xianyu.png",
    logoWidth: 242,
    logoHeight: 150,
  },
  {
    id: "factories",
    label: "Buy from factories",
    href: "/factory-verification",
    logo: null,
    logoWidth: 0,
    logoHeight: 0,
  },
] as const;
