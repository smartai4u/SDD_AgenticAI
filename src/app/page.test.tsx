import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the placeholder heading and text", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Placeholder" }),
    ).toBeInTheDocument();
    expect(screen.getByText("App skeleton ready")).toBeInTheDocument();
  });

  it("renders the Button using the primary (green accent) style", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: "Get started" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-primary");
  });
});
