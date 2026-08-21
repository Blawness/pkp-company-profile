/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, describe, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import React from "react";
import { ContactForm } from "@/components/forms/ContactForm";

// Mock fetch
const mockFetch = mock(() => Promise.resolve({ ok: true }));
global.fetch = mockFetch as any;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Without an ID the form takes the mailto path instead of posting, so the
    // POST-based cases below need one configured.
    process.env.NEXT_PUBLIC_FORMSPREE_ID = "test-id";
  });

  test("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Contact.form.name")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact.form.email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact.form.message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Common.buttons.send" }),
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    render(<ContactForm />);
    fireEvent.click(
      screen.getByRole("button", { name: "Common.buttons.send" }),
    );

    await waitFor(() => {
      // These are defined in ContactForm's Zod schema using t("validation.xxx")
      expect(
        screen.getByText("Contact.form.validation.nameMin"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Contact.form.validation.emailInvalid"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Contact.form.validation.messageMin"),
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText("Contact.form.name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Contact.form.email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Contact.form.message"), {
      target: { value: "This is a test message that is long enough." },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Common.buttons.send" }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(screen.getByText("Contact.form.success")).toBeInTheDocument();
    });
  });

  test("stays usable without a Formspree endpoint, via mailto", async () => {
    // A public page must never be told to go set an env var, and the submit
    // button must not sit there dead — the message goes to the mail client.
    process.env.NEXT_PUBLIC_FORMSPREE_ID = "";

    const assigned: string[] = [];
    const original = Object.getOwnPropertyDescriptor(window, "location");
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        set href(value: string) {
          assigned.push(value);
        },
        get href() {
          return assigned[assigned.length - 1] ?? "";
        },
      },
    });

    try {
      render(<ContactForm />);

      const button = screen.getByRole("button", {
        name: "Common.buttons.send",
      });
      expect((button as HTMLButtonElement).disabled).toBe(false);
      expect(screen.getByText("Contact.form.missing")).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText("Contact.form.name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByLabelText("Contact.form.email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contact.form.message"), {
        target: { value: "This is a test message that is long enough." },
      });
      fireEvent.click(button);

      await waitFor(() => {
        expect(assigned.length).toBe(1);
      });
      expect(assigned[0]).toStartWith("mailto:presisikonsulindo@gmail.com?");
      expect(assigned[0]).toContain("John%20Doe");
      expect(mockFetch).not.toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(window, "location", original);
    }
  });

  test("inputs use underline styling instead of boxed borders", () => {
    const { container } = render(<ContactForm />);
    const input = container.querySelector("input");
    expect(input?.className).toContain("border-b");
    expect(input?.className).not.toContain("rounded-xl");
  });
});
