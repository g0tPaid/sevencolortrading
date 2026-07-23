import { FloatingNav } from "@/components/layout/floating-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNav />
      <main id="main" className="min-h-screen pt-20">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
