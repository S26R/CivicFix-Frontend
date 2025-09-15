import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "@env";

const Departments = () => {
  const { token } = useAuthStore();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/authority/getAlldepartment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch departments");

        const data = await res.json();
        setDepartments(data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [token]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f4511e" />
        <Text className="mt-2 text-gray-600">Loading Departments...</Text>
      </View>
    );
  }

  if (!departments.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">No departments found</Text>
      </View>
    );
  }

  // 🔑 Helper function to slice email
  const getNameFromEmail = (email) => {
    if (!email) return "Unknown";
    return email.split(".")[0]; // everything before the first "."
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-orange-600 mb-4">
        Departments List
      </Text>

      <FlatList
        data={departments}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <View className="bg-pink-50 rounded-xl p-4 mb-3 border border-pink-100 shadow-sm">
            {/* 🆕 Use the helper function here */}
            <Text className="text-lg font-semibold text-pink-700">
              {getNameFromEmail(item.email)}
            </Text>
            <Text className="text-gray-600">📧 {item.email}</Text>
            <Text className="text-gray-600">📱 {item.phone}</Text>
            <Text className="text-gray-600">🏢 {item.aadhaar}</Text>
          </View>
        )}
      />
    </View>
  );
};

// ✅ Header title in Expo Router
export const unstable_settings = {
  headerTitle: "Departments",
};

export default Departments;
