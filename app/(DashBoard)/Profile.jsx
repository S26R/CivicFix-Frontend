import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore.js";
import { API_URL } from "@env";
export default function Profile() {
  const { token, user, logout } = useAuthStore();
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  if (!token || !user) return; // wait until store has values

  const fetchProfile = async () => {
    setLoading(true);
    try {
   

      const res = await fetch(`${API_URL}/api/auth/profile/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const data = await res.json();

      if (res.ok) {
        setProfile(data);
        console.log("Profile data:", data);
      } else {
        console.error("Error fetching profile:", data.msg);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token, user]); // effect will re-run once token/user are populated


  // Logout handler
  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">Failed to load profile</Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 px-4 py-2 mt-4 rounded-xl"
        >
          <Text className="text-white font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <Text className="text-2xl font-bold text-orange-600 mb-2">
          {profile.name || "Citizen"}
        </Text>
        <Text className="text-gray-700">📞 {profile.phone}</Text>
        <Text className="text-gray-700">📧 {profile.email}</Text>
        <Text className="text-gray-700">🏠 {profile.villageArea}</Text>
        <Text className="text-gray-700">Ward: {profile.wardNumber}</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-orange-500 rounded-xl py-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
