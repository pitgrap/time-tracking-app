import { ReactNode } from "react";

export interface AppContext {
  showSettings: boolean;
  openSettings?: () => void;
  closeSettings?: () => void;
  showHistory: boolean;
  openHistory?: () => void;
  closeHistory?: () => void;
}

export interface Props {
  children: ReactNode;
}
