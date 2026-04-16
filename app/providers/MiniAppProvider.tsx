'use client'

import { createContext, useContext, type ReactNode } from 'react';

interface MiniAppContextValue {
  context: undefined;
  isReady: boolean;
}

export const MiniAppContext = createContext<MiniAppContextValue>({
  context: undefined,
  isReady: true,
});

export function useMiniApp() {
  return useContext(MiniAppContext);
}

export function MiniAppProvider({ children }: { children: ReactNode }) {
  return (
    <MiniAppContext.Provider value={{ context: undefined, isReady: true }}>
      {children}
    </MiniAppContext.Provider>
  );
}
