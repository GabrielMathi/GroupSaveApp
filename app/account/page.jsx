export const dynamic = 'force-dynamic'; // empêche le prerender

import AccountClient from "./AccountClient";

export default function Page() {
  return <AccountClient />;
}