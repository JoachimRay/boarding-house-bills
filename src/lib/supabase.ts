import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY?.trim();

if (!url) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL. Restart Expo from the project root with: npm.cmd start -- --clear",
  );
}

if (!key) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_KEY. Restart Expo from the project root with: npm.cmd start -- --clear",
  );
}

const webStorage = {
  getItem: async (storageKey: string) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(storageKey),
  setItem: async (storageKey: string, value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, value);
    }
  },
  removeItem: async (storageKey: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
  },
};

export const supabase = createClient(url, key, {
  auth: {
    storage: Platform.OS === "web" ? webStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});