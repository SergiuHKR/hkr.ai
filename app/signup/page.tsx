import { redirect } from "next/navigation";

// With Google SSO, signup and login are the same flow
export default function SignUpPage() {
  redirect("/login");
}
