import type { APIRoute } from "astro";
import { getPeople, getTranslations, toTreeData } from "../lib/people";
import { renderPosterSVG } from "../lib/poster";
import { useTranslations } from "../i18n/ui";

export const GET: APIRoute = async () => {
  const t = useTranslations("bs");
  const people = await getPeople();
  const translations = await getTranslations();
  const svg = renderPosterSVG(toTreeData(people, translations, "bs"), {
    title: t("home.title"),
    subtitle: t("tree.subtitle"),
  });
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
};
