"use client";

import { trackGaEvent } from "@/lib/ga";
import { whatsappHref } from "@/lib/whatsapp";

type Props = {
  hrefMessage: string;
  className?: string;
  children: React.ReactNode;
  productName?: string;
  productSlug?: string;
  category?: string;
  buttonLocation: string;
  sourcePage: string;
};

/** Uses the existing WhatsApp `contact` event so product clicks are not a second conversion. */
export function SourceProductLink({
  hrefMessage,
  className,
  children,
  productName,
  productSlug,
  category,
  buttonLocation,
  sourcePage,
}: Props) {
  return (
    <a
      href={whatsappHref(hrefMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackGaEvent("contact", {
          method: "whatsapp",
          product_name: productName,
          product_slug: productSlug,
          page: sourcePage,
          category,
          button_location: buttonLocation,
          source_page: sourcePage,
        })
      }
    >
      {children}
    </a>
  );
}
