import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import rehypeLinkPeople from "../plugins/rehype-link-people.mjs";

const DIR = "src/content/people";
const extendedId = readdirSync(DIR)
  .filter((file) => matter(readFileSync(`${DIR}/${file}`, "utf8")).data.visibility === "extended")[0]!
  .replace(/\.md$/, "");

const linkTo = (href: string) => ({
  type: "root",
  children: [{ type: "element", tagName: "a", properties: { href }, children: [] }],
});
const run = (tree: ReturnType<typeof linkTo>, path: string) => {
  rehypeLinkPeople()(tree, { path });
  return tree.children[0]!.properties.href;
};

describe("rehypeLinkPeople", () => {
  it("sends hand-written links for extended-only people to their real route", () => {
    expect(run(linkTo(`/people/${extendedId}`), "people/x.md")).toBe(`/extended/people/${extendedId}`);
    expect(run(linkTo(`/en/people/${extendedId}`), "translations/x.md")).toBe(
      `/en/extended/people/${extendedId}`,
    );
  });

  it("leaves other links alone", () => {
    expect(run(linkTo("https://example.com/people/x"), "people/x.md")).toBe("https://example.com/people/x");
  });
});
