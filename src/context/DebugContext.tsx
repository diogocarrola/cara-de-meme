"use client";

import React, { createContext, useContext, useState } from "react";

interface DebugContextValue {
  debug: boolean;
  setDebug: (v: boolean) => void;
  toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextValue | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debug, setDebug] = useState(false);
  const toggleDebug = () => setDebug((s) => !s);
  return (
    <DebugContext.Provider value={{ debug, setDebug, toggleDebug }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const ctx = useContext(DebugContext);
  if (!ctx) throw new Error("useDebug must be used within DebugProvider");
  return ctx;
}

export default DebugContext;
