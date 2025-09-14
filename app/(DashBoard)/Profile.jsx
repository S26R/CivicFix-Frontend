import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore.js";
import { API_URL } from "@env";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
            Authorization: `Bearer ${token}`,
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
    <View className="flex-1 justify-between p-4 bg-orange-50">
      <ScrollView className="flex-1 bg-orange-50">
        {/* Title */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-orange-600 mb-4">
            Your Profile
          </Text>

          {/* Profile Info Card */}
          <View className="rounded-2xl bg-white shadow-lg border border-orange-200 p-5">
            {/* Name */}
            <View className="mb-4">
              <Text className="text-2xl font-bold text-orange-600">
                {profile?.name || "Citizen"}
              </Text>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <View className="flex-row items-center mb-1">
              <Ionicons
                className="w-7"
                name="call-outline"
                size={22}
                color="#f97316"
              />
              <Text className="text-sm text-gray-500">Phone</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {profile?.phone || "Not Available"}
              </Text>
            </View>

            {/* Email */}
            <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Ionicons
                className="w-7"
                name="mail-open-outline"
                size={22}
                color="#f97316"
              />
              <Text className="text-sm text-gray-500">Email</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {profile?.email || "Not Available"}
              </Text>
            </View>

            {/* Aadhaar */}
            <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Ionicons
                className="w-7"
                name="id-card-outline"
                size={22}
                color="#f97316"
              />
              <Text className="text-sm text-gray-500">Aadhaar</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {profile?.aadhaar || "Not Available"}
              </Text>
            </View>

            {/* Municipality */}
            <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Ionicons
                className="w-7"
                name="business-outline"
                size={22}
                color="#f97316"
              />
              <Text className="text-sm text-gray-500">Municipality</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {profile?.villageArea || "Not Available"}
              </Text>
            </View>

            {/* Ward No */}
            <View className="mb-2">
            <View className="flex-row items-center mb-1">
              <Ionicons
                className="w-7"
                name="location-outline"
                size={22}
                color="#f97316"
              />
              <Text className="text-sm text-gray-500">Ward No</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {profile?.wardNumber || "Not Available"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
