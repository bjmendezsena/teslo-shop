import React, { createContext } from "react";

interface ContextProps {
  isMenuOpened: boolean;
  toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);
