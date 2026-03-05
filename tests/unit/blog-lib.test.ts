import { extractHeadings, extractTags, getReadingTimeMinutes, getTrendingScore, stripHtml, withHeadingAnchors } from "@/lib/blog";
import { samplePost } from "../mocks/fixtures";

describe("unit: lib/blog", () => {
  it("strips html and computes reading time", () => {
    const text = stripHtml("<h2>Title</h2><p>Hello world</p>");
    expect(text).toContain("Title");
    expect(getReadingTimeMinutes("<p>word</p>")).toBe(1);
  });

  it("extracts h2/h3 headings and adds anchors", () => {
    const html = "<h2>Section One</h2><p>A</p><h3>Sub Topic</h3>";
    const headings = extractHeadings(html);
    expect(headings).toHaveLength(2);

    const anchored = withHeadingAnchors(html);
    expect(anchored).toContain('id="section-one"');
    expect(anchored).toContain('id="sub-topic"');
  });

  it("extracts tags and computes trending score", () => {
    const tags = extractTags({ ...(samplePost as never), title: "Marketplace Conversion Strategy" });
    expect(tags.length).toBeGreaterThan(0);

    const score = getTrendingScore(samplePost as never);
    expect(score).toBeGreaterThan(0);
  });
});
