import { Container, SpectrumRail } from "@/components/ui/primitives";

export function BrandStatement() {
  return (
    <section aria-label="Brand statement" className="section-y">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <SpectrumRail className="mb-8 w-12 sm:mb-10" />
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            Making life affordable for normal people.
          </p>
          <p className="mt-5 font-display text-2xl font-medium leading-snug text-muted sm:mt-6 sm:text-3xl md:text-4xl">
            God bless China.{" "}
            <span role="img" aria-label="China">
              🇨🇳
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
