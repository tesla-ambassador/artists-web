"use client";

import React from "react";
import { useStore } from "zustand";
import { type ReleaseStore, createReleaseStore } from "@/store/releases-store";

export type ReleaseStoreAPI = ReturnType<typeof createReleaseStore>;

export const ReleaseStoreContext = React.createContext<
  ReleaseStoreAPI | undefined
>(undefined);

export interface ReleaseStoreProviderProps {
  children: React.ReactNode;
}

export const ReleaseStoreProvider = ({
  children,
}: ReleaseStoreProviderProps) => {
  const storeRef = React.useRef<ReleaseStoreAPI | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createReleaseStore();
  }

  return (
    <ReleaseStoreContext.Provider value={storeRef.current}>
      {children}
    </ReleaseStoreContext.Provider>
  );
};

export const useReleaseStore = <T,>(
  selector: (store: ReleaseStore) => T
): T => {
  const releaseStoreContext = React.useContext(ReleaseStoreContext);

  if (!releaseStoreContext) {
    throw new Error(
      `useReleaseStore must be used within the ReleaseStoreProvider`
    );
  }

  return useStore(releaseStoreContext, selector);
};
