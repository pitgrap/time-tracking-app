import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { AppContextProvider, useAppContext } from "../contexts/AppContext";
import { initTranslations } from "../utils/Translations";

const StateDisplay: React.FC = () => {
  const { showSettings, showHistory } = useAppContext();
  return (
    <span data-testid="state">
      {showSettings ? "settings" : ""}
      {showHistory ? "history" : ""}
    </span>
  );
};

beforeEach(() => {
  initTranslations();
});

describe("Header", () => {
  it("exposes the history/settings controls as real, keyboard-accessible buttons", () => {
    render(
      <AppContextProvider>
        <Header />
        <StateDisplay />
      </AppContextProvider>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    fireEvent.click(screen.getByTitle("Show History"));
    expect(screen.getByTestId("state")).toHaveTextContent("history");
  });
});
