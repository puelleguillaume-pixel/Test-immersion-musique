import { create } from "zustand";

interface AudioState {
  ambientEnabled: boolean;
  toggleAmbient: () => void;
  activePlayerId: string | null;
  setActivePlayer: (id: string | null) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  ambientEnabled: false,
  toggleAmbient: () => set({ ambientEnabled: !get().ambientEnabled }),
  activePlayerId: null,
  setActivePlayer: (id) => set({ activePlayerId: id }),
}));
