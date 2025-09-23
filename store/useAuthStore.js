// store/useAuthStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isReady: false,
  
  // Load token + decode user on app start
  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem("civic-auth-token");
      if (token) {
        const decoded = jwtDecode(token);
        set({ token, user: decoded, role: decoded.role, isReady: true });
      } else {
        set({ isReady: true });
      }
    } catch (e) {
      console.error("Failed to load token:", e);
      set({ isReady: true });
    }
  },

  // Init wrapper
  init: async () => {
    await useAuthStore.getState().loadToken();
  },

  login: async (token) => {
    try {
      await AsyncStorage.setItem("civic-auth-token", token);
      const decoded = jwtDecode(token);
      set({ token, user: decoded, role: decoded.role });
    } catch (e) {
      console.error("Login error:", e);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("civic-auth-token");
      set({ token: null, user: null, role: null, isReady: true });
    } catch (e) {
      console.error("Logout error:", e);
      // Even if AsyncStorage fails, clear the state
      set({ token: null, user: null, role: null, isReady: true });
      throw e; // Re-throw to handle in UI
    }
  },
}));
