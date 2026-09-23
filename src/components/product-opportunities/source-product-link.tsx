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
      onClick={() => {
        const params: Record<string, string> = {
          method: "whatsapp",
          page: sourcePage,
          button_location: buttonLocation,
          source_page: sourcePage,
        };
        if (productName) params.product_name = productName;
        if (productSlug) params.product_slug = productSlug;
        if (category) params.category = category;
        trackGaEvent("contact", params);
      }}
    >
      {children}
    </a>
  );
}
