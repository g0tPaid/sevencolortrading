import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Sourcing Center</h1>
        <p className={styles.text}>Open Sourcing Center from Apps in your Shopify admin. Shopify authenticates your store automatically; you do not need to enter a store domain.</p>
        <p><a href="https://admin.shopify.com/">Open Shopify admin</a></p>
      </div>
    </div>
  );
}
