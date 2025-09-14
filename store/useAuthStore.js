import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isReady: false, // NEW flag so we know when token is loaded

  // Load token + decode user on app start
  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        set({ token, user: decoded, isReady: true });
      } else {
        set({ isReady: true }); // mark as ready even if no token
      }
    } catch (e) {
      console.error("Failed to load token:", e);
      set({ isReady: true });
    }
  },

  // Save token + decode user after login
  login: async (token) => {
    try {
      await AsyncStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      set({ token, user: decoded });
    } catch (e) {
      console.error("Login error:", e);
    }
  },

  // Logout and clear everything
  logout: async () => {
    try {
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("authorityToken"); // in case of authority login
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("deptToken"); // in case of dept login
      await AsyncStorage.removeItem("dept"); // in case of dept login
      set({ token: null, user: null });
    } catch (e) {
      console.error("Logout error:", e);
    }
  },
}));
