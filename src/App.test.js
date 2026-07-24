import { render, screen, within } from "@testing-library/react";
import App from "./App";

test("renders header navigation and home scene", () => {
  render(<App />);
  const navigation = screen.getByRole("navigation", { name: /primary/i });

  expect(
    within(navigation).getByRole("link", { name: /^home$/i }),
  ).toBeInTheDocument();
  expect(
    within(navigation).getByRole("link", { name: /^about$/i }),
  ).toBeInTheDocument();
  expect(
    within(navigation).getByRole("link", { name: /^portfolio$/i }),
  ).toBeInTheDocument();
  expect(
    within(navigation).getByRole("link", { name: /^contact$/i }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/3d drive stage/i)).toBeInTheDocument();
});
