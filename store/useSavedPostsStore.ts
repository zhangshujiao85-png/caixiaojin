import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedPostsState {
  savedPostIds: string[];
  toggleSavePost: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;
}

export const useSavedPostsStore = create<SavedPostsState>()(
  persist(
    (set, get) => ({
      savedPostIds: [],

      toggleSavePost: (postId: string) => {
        const state = get();
        const isSaved = state.savedPostIds.includes(postId);
        const newSavedIds = isSaved
          ? state.savedPostIds.filter((id) => id !== postId)
          : [...state.savedPostIds, postId];
        set({ savedPostIds: newSavedIds });
      },

      isPostSaved: (postId: string) => {
        return get().savedPostIds.includes(postId);
      },
    }),
    {
      name: "saved-posts-storage",
    }
  )
);
