import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { History } from "./History";
import { AppContextProvider, useAppContext } from "../contexts/AppContext";
import { SettingsContextProvider } from "../contexts/SettingsContext";
import { initTranslations } from "../utils/Translations";

const OpenHistoryButton: React.FC = () => {
  const { openHistory } = useAppContext();
  return <button onClick={openHistory}>open</button>;
};

const renderHistory = () =>
  render(
    <AppContextProvider>
      <SettingsContextProvider>
        <OpenHistoryButton />
        <History />
      </SettingsContextProvider>
    </AppContextProvider>,
  );

beforeEach(() => {
  initTranslations();
  localStorage.clear();
});

describe("History", () => {
  it("opens via the native showModal() API", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(true);
    expect(screen.getByText("No history available.")).toBeInTheDocument();
  });

  it("closes when the backdrop (not the dialog content) is clicked", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    fireEvent.click(dialog);

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("does not close when clicking inside the dialog content", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));

    fireEvent.click(screen.getByText("History"));

    expect(document.querySelector("dialog")).toBeInTheDocument();
  });

  it("closes via the close (X) button", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));

    fireEvent.click(screen.getByTitle("Close"));

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("stays in sync when the dialog is closed natively (e.g. via ESC)", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    fireEvent(dialog, new Event("close"));

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("can be reopened after being closed", () => {
    renderHistory();
    fireEvent.click(screen.getByText("open"));
    fireEvent.click(screen.getByTitle("Close"));
    expect(document.querySelector("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("open"));
    expect(document.querySelector("dialog")).toBeInTheDocument();
    expect(document.querySelector("dialog")!.open).toBe(true);
  });
});
