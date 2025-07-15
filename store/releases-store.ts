import { createStore } from "zustand";
import { releaseData } from "@/data/archive-data";
import { Releases } from "@/app/dashboard/archive/Experiments";

export type ReleaseState = {
  releases: Releases[];
};

export type ReleaseActions = {
  addRelease: (newReleases: Releases[]) => void;
};

export type ReleaseStore = ReleaseState & ReleaseActions;

const defaultInitState: ReleaseState = {
  releases: releaseData,
};

export const createReleaseStore = (
  initState: ReleaseState = defaultInitState
) => {
  return createStore<ReleaseStore>()((set) => ({
    ...initState,
    addRelease: (newReleases: Releases[]) =>
      set((state) => ({ releases: [...state.releases, ...newReleases] })),
  }));
};
