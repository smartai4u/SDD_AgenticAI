import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "inter-font-variable" }),
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  const markup = renderToStaticMarkup(
    <RootLayout params={Promise.resolve({})}>
      <p>child content</p>
    </RootLayout>,
  );

  it("renders its children", () => {
    expect(markup).toContain("child content");
  });

  it("applies the Inter font class to the root element", () => {
    expect(markup).toContain("inter-font-variable");
  });
});
