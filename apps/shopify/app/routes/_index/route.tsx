import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

const features = [
  ["Connect your store", "Link your Shopify store to Sourcing Center."],
  ["View recent orders", "See order totals, payment and fulfillment status."],
  ["Work with our China team", "Coordinate sourcing, quality checks, warehousing and international shipping."],
];

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  return (
    <main style={{ minHeight: "100vh", boxSizing: "border-box", background: "linear-gradient(140deg,#f8fafc,#e9edf3)", fontFamily: "system-ui,sans-serif", color: "#172033", padding: "clamp(20px,5vw,72px)" }}>
      <div style={{ maxWidth: 980, margin: "auto", textAlign: "center" }}>
        <div style={{ display: "inline-grid", placeItems: "center", width: 88, height: 88, background: "linear-gradient(135deg,#fff,#e7ebf2)", border: "1px solid white", borderRadius: 23, boxShadow: "0 10px 30px #253b5c22" }}>
          <img src="https://sourcing.center/seven-color-mark-clear.png" alt="Seven Color" width={64} height={64} style={{ objectFit: "contain" }} />
        </div>
        <p style={{ color: "#e60043", textTransform: "uppercase", fontWeight: 700, letterSpacing: 3, fontSize: 12, marginTop: 24 }}>Seven Color · Sourcing Center</p>
        <h1 style={{ fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-.04em", margin: "12px 0" }}>Your China sourcing partner, connected.</h1>
        <p style={{ fontSize: 18, color: "#536176", lineHeight: 1.6, maxWidth: 640, margin: "0 auto 32px" }}>Connect your store and view recent order activity in one place, with your dedicated sourcing and fulfillment team.</p>
        {showForm && (
          <Form method="post" style={{ maxWidth: 440, margin: "0 auto 36px", padding: 24, border: "1px solid #fff", borderRadius: 20, background: "#ffffffcc", boxShadow: "0 10px 35px #253b5c12", textAlign: "left" }}>
            <label style={{ display: "grid", gap: 8, fontSize: 14, fontWeight: 650 }}>
              Shopify store domain
              <input required type="text" name="shop" placeholder="your-store.myshopify.com" autoComplete="url" style={{ padding: 14, border: "1px solid #bec9d8", borderRadius: 10, font: "inherit" }} />
              <span style={{ fontSize: 12, color: errors?.shop ? "#b00030" : "#65738a", fontWeight: 400 }}>{errors?.shop ?? "Enter your permanent .myshopify.com domain."}</span>
            </label>
            <button type="submit" style={{ width: "100%", background: "#e60043", color: "white", padding: 14, border: 0, borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 18 }}>Connect store</button>
          </Form>
        )}
        <section aria-label="App features" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, textAlign: "left" }}>
          {features.map(([title, description]) => <article key={title} style={{ background: "#ffffffb3", border: "1px solid #fff", padding: 22, borderRadius: 16 }}><h2 style={{ fontSize: 17, margin: "0 0 8px" }}>{title}</h2><p style={{ color: "#536176", lineHeight: 1.5, margin: 0 }}>{description}</p></article>)}
        </section>
        <p style={{ fontSize: 13, color: "#65738a", marginTop: 32 }}>Learn more at <a href="https://sourcing.center" style={{ color: "#b70036" }}>sourcing.center</a></p>
      </div>
    </main>
  );
}
