import { ReactNode } from "react";

export interface AppContext {
  showSettings: boolean;
  toggleSettings?: () => void;
  showHistory: boolean;
  toggleHistory?: () => void;
}

export interface Props {
  children: ReactNode;
}
