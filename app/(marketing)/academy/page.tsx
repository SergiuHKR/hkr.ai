import { redirect } from "next/navigation";

// /academy is now served at /learn — redirect for backward compatibility
export default function AcademyPage() {
  redirect("/learn");
}
