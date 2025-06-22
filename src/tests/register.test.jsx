import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Register from "../pages/register";
import { vi } from "vitest";

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

vi.mock("../services/auth-service", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

describe("Register component", () => {
  it("renders the register form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/your password/i)).toHaveLength(2); // Password and confirm password
    expect(screen.getAllByText(/Register/i)).toHaveLength(2); // Title and button
  });

  it("updates form state", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/your email/i);
    const passwordInput = screen.getByPlaceholderText(/Confirm your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("123456");
  });
});