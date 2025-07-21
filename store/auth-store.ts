import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthStore {
  activeUser: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  activeUser: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true });

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error.message);
        set({ activeUser: null, loading: false });
        return;
      }

      set({ activeUser: data.user, loading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ activeUser: null, loading: false });
    }
  },
}));
