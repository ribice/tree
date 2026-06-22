import { getPeople, getTranslations, toTreeData } from "../../lib/people";

export const prerender = true;

export async function GET() {
  const people = await getPeople();
  const translations = await getTranslations();
  return new Response(JSON.stringify(toTreeData(people, translations, "en")), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
