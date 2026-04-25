import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // This component automatically handles the redirect data from Google/LinkedIn
  // and pushes the user to the redirectUrlComplete (/dashboard)
  return <AuthenticateWithRedirectCallback />;
}
