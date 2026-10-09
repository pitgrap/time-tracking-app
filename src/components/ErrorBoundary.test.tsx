import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const Bomb: React.FC = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  it("renders a fallback instead of crashing the whole app when a child throws", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong. Reloading the page may fix it.")).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("renders children normally when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("all good")).toBeInTheDocument();
  });
});
