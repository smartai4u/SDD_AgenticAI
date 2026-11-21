import { expect, test } from "@playwright/test";

test("home page shows the placeholder content with no console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Placeholder" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
  expect(errors).toEqual([]);
});
