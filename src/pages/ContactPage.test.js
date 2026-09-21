import { fireEvent, render, screen } from "@testing-library/react";
import { buildApiUrl } from "../config/api";
import ContactPage from "./ContactPage";

test("renders the contact form fields", () => {
  render(<ContactPage />);

  expect(screen.getByLabelText(/project type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/page scope/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/desired timeline/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/support level/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /request project details/i }),
  ).toBeInTheDocument();
});

test("submits contact form data to the configured api", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });

  window.fetch = fetchMock;

  render(<ContactPage />);

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Jane Client" },
  });
  fireEvent.change(screen.getByLabelText(/project type/i), {
    target: { value: "pricing-page" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/subject/i), {
    target: { value: "New project" },
  });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: "I need a new portfolio website." },
  });

  fireEvent.click(
    screen.getByRole("button", { name: /request project details/i }),
  );

  expect(
    await screen.findByText(/your message has been sent/i),
  ).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith(
    buildApiUrl("/contacts/"),
    expect.objectContaining({
      method: "POST",
      body: expect.stringContaining("Scope estimator:"),
    }),
  );
  expect(fetchMock.mock.calls[0][1].body).toContain("estimator_project_type");
});
