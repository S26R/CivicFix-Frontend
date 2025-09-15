import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";

const DepartmentHome = () => {
  
  const router = useRouter();
  const [dept, setDept] = useState("");
  const { logout } = useAuthStore();
  // Get saved department & token on mount
  useEffect(() => {
    const fetchDept = async () => {
      try {
        const savedDept = await AsyncStorage.getItem("dept"); // if you saved dept separately
        if (savedDept) setDept(savedDept);
      } catch (err) {
        console.log("Error reading dept:", err);
      }
    };
    fetchDept();
  }, []);

   const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View
        className="w-full bg-white rounded-2xl p-6 max-w-xl mt-2 mb-5"
        style={{
          shadowColor: "#FFA500",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <Text className="text-3xl font-bold text-center text-orange-600 mb-6">
          Department Management
        </Text>

        <Text className="text-lg text-center mb-6 text-gray-700">
          Welcome to the Department Management Panel
          {dept ? ` — ${dept}` : ""}
        </Text>

        <TouchableOpacity
          onPress={() => Alert.alert("Feature", "This is a sample feature")}
          className="bg-orange-500 rounded-xl py-3 mb-4"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            View Complaints
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert("Feature", "This is a sample feature")}
          className="bg-orange-500 rounded-xl py-3 mb-4"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Manage Staff
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-xl py-3 mt-4"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DepartmentHome;
