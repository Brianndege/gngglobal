import { markdownToHtml, parseBool, parseCsvList, parseDate, slugify } from "@/server/cms-utils";

describe("unit: cms utils", () => {
  it("slugifies text correctly", () => {
    expect(slugify("Hello World! 2026")).toBe("hello-world-2026");
  });

  it("parses boolean values", () => {
    expect(parseBool("true")).toBe(true);
    expect(parseBool("false")).toBe(false);
  });

  it("parses csv list values", () => {
    expect(parseCsvList("alpha, beta, gamma")).toEqual(["alpha", "beta", "gamma"]);
  });

  it("parses valid date and rejects invalid", () => {
    expect(parseDate("2026-03-01T10:00:00.000Z")?.toISOString()).toBe("2026-03-01T10:00:00.000Z");
    expect(parseDate("invalid-date")).toBeNull();
  });

  it("converts markdown to html with code blocks and links", () => {
    const html = markdownToHtml("## Title\n\nUse [docs](https://example.com)\n\n```\nconst a = 1\n```");
    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain("https://example.com");
    expect(html).toContain("<pre><code>");
  });
});
