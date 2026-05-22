import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AvailabilityStore {
  slots: string[];
  toggle: (day: string, slotIndex: number) => void;
  clear: () => void;
}
export const useScheduleStore = create<AvailabilityStore>()(
  persist(
    (set) => ({
      slots: [],
      toggle: (day, slotIndex) => {
        const key = `${day}-${slotIndex}`;
        set((state) => ({
          slots: state.slots.includes(key)
            ? state.slots.filter((s) => s !== key)
            : [...state.slots, key],
        }));
      },
      clear: () => set({ slots: [] }),
    }),
    { name: 'patricia-availability' },
  ),
);