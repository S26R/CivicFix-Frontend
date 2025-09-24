import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import { useAuthStore } from "../store/useAuthStore";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

const DeptLogin = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const router = useRouter();
  const { login } = useAuthStore(); // use Zustand store
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ phone: "", password: "" });

  const handleChange = (key, value) => setLoginData({ ...loginData, [key]: value });

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login/department`, {
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
       Toast.show({type:"error",text1:"Sorry 🥺",text2:"Something went Wrong"})
        return;
      }

      if (response.ok && data.token) {
        // Store token and decoded user in Zustand
        await login(data.token);

        Toast.show({type:"success",text1:"Welcome 😍",text2:"Logged In Successfully"})
        router.replace("/(Department)/DepartmentHome"); // replace so user cannot go back
      } else {
      Toast.show({type:"error",text1:"Sorry 🥺",text2:"Invalid Credentials"})
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({type:"error",text1:"Sorry 🥺",text2:"Something went Wrong"})
    } finally {
      setLoading(false);
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
          <Text
  className={`text-white text-center text-lg font-semibold ${
    loading ? "animate-pulse" : "animate-none"
  }`}
>
  {loading ? "Logging in..." : "Login"}
</Text>

        </TouchableOpacity>

        
      </View>
    </View>
  );
};

export default DeptLogin;
