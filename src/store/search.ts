import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  history: string[];
  push: (q: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      history: [],
      push: (q) => set((s) => ({ history: [q, ...s.history.filter((h) => h !== q)].slice(0, 6) })),
      clear: () => set({ history: [] }),
    }),
    { name: "historia.search" },
  ),
);
