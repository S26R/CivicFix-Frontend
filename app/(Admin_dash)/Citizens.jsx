import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

import Constants from "expo-constants";
const Citizens = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const { token } = useAuthStore();
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchCitizens = async () => {
      
      try {
        const res = await fetch(`${API_URL}/api/authority/getAllcitizen`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch citizens");

        const data = await res.json();
        setCitizens(data || []);
      } catch (err) {
        console.error("Error fetching citizens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, [token]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f4511e" />
        <Text className="mt-2 text-gray-600">Loading Citizens...</Text>
      </View>
    );
  }

  if (!citizens.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">No citizens found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-orange-600 mb-4">
        Citizens List
      </Text>

      <FlatList
        data={citizens}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <View className="bg-indigo-50 rounded-xl p-4 mb-3 border border-indigo-100 shadow-sm">
            
            <Text className="text-gray-600">📧 {item.email}</Text>
            <Text className="text-gray-600">📱 {item.phone}</Text>
            <Text className="text-gray-600">🏠 Ward: {item.wardNumber}</Text>
            <Text className="text-gray-600">🆔 Aadhaar: {item.aadhaar}</Text>
          </View>
        )}
      />
    </View>
  );
};

// ✅ This will show a nice header in Expo Router
export const unstable_settings = {
  headerTitle: "Citizens",
};

export default Citizens;
