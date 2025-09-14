import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env"; // import backend URL

const deptLogin = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    phone: "", 
    password: "",
  });

  const handleChange = (key, value) => {
    setLoginData({ ...loginData, [key]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login/department`, {
        // 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData), 
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Non-JSON response:", text);
        Alert.alert("Error", "Server returned an unexpected response");
        return;
      }

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem("authorityToken", data.token);
          console.log("Authority token saved:", data.token);
        }
        Alert.alert("Success", "Logged in successfully!");
        router.push("/DepartmentHome");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Unable to connect to server");
    }
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
        <Text className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login as Department
        </Text>

        {/* Phone */}
        <Text className="text-orange-600 mb-1 font-semibold">Phone Number</Text>
        <TextInput
          placeholder="Enter phone number"
          value={loginData.phone}
          onChangeText={(val) => handleChange("phone", val)}
          keyboardType="numeric"
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base text-black"
          placeholderTextColor="#fb923c"
        />

        {/* Password */}
        <Text className="text-orange-600 mb-1 font-semibold">Password</Text>
        <TextInput
          placeholder="Enter password"
          value={loginData.password}
          onChangeText={(val) => handleChange("password", val)}
          secureTextEntry
          className="border border-orange-300 rounded-xl px-4 py-3 mb-6 text-base text-black"
          placeholderTextColor="#fb923c"
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-orange-500 rounded-xl py-3 mb-4"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        {/* Don’t have account? */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-orange-600 text-center text-base">
            Don’t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default deptLogin;
