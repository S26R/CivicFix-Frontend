import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage"; // 👈 new
import Constants from "expo-constants";
const Signup = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    aadhaar: "",
    password: "",
    wardNumber: "",
    villageArea: "",
    location: "",
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const router = useRouter();
  
  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ If backend sends token & role on signup:
        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
        }

        // Decide where to go based on role
        if (data.role === "department") {
          router.push("/deptLanding");
        } else if (data.role === "authority") {
          router.push("/home_admin");
        } else {
          router.push("/citizenLogin");
        }

        Alert.alert("Success", data.msg || "Account created successfully!");
      } else {
        // User already exists case
        if (data.msg && data.msg.toLowerCase().includes("already exists")) {
          Alert.alert("Account exists", "Redirecting to login…");

          // You can decide logic by phone prefix or let them choose here.
          // For now just redirect to citizen login:
          router.push("/citizenLogin");
        } else {
          Alert.alert("Error", data.msg || "Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to connect to server");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <ScrollView
        className="w-full bg-white rounded-2xl p-6 max-w-xl mt-2 mb-5"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{
          shadowColor: "#FFA500",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <Text className="text-2xl font-bold text-center text-orange-600 mb-6">
          Create Account
        </Text>

        {/* Email */}
        <Text className="text-orange-600 mb-1 font-semibold">Email</Text>
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(val) => handleChange("email", val)}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base text-black"
          placeholderTextColor="#fb923c"
        />

        {/* Phone */}
        <Text className="text-orange-600 mb-1 font-semibold">Phone Number</Text>
        <TextInput
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
        />

        {/* Aadhaar */}
        <Text className="text-orange-600 mb-1 font-semibold">Aadhaar Number</Text>
        <TextInput
          placeholder="Enter Aadhaar Number"
          keyboardType="number-pad"
          maxLength={12}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.aadhaar}
          onChangeText={(value) => handleChange("aadhaar", value)}
        />

        {/* Password */}
        <Text className="text-orange-600 mb-1 font-semibold">Password</Text>
        <TextInput
          placeholder="Enter password"
          secureTextEntry
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
        />

        {/* Village Area */}
        <Text className="text-orange-600 mb-1 font-semibold">Village Area</Text>
        <TextInput
          placeholder="Enter village area"
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.villageArea}
          onChangeText={(value) => handleChange("villageArea", value)}
        />

        {/* Ward Number */}
        <Text className="text-orange-600 mb-1 font-semibold">Ward Number</Text>
        <TextInput
          placeholder="Enter ward number"
          keyboardType="number-pad"
          maxLength={3}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.wardNumber}
          onChangeText={(value) => handleChange("wardNumber", value)}
        />

        {/* Location */}
        <Text className="text-orange-600 mb-1 font-semibold">Location</Text>
        <View className="border border-orange-300 rounded-xl mb-6 overflow-hidden">
          <Picker
            selectedValue={formData.location}
            onValueChange={(value) => handleChange("location", value)}
            className="px-4 py-3 text-base"
          >
            <Picker.Item label="Select Location" value="" />
            <Picker.Item label="Sub-Area 1" value="sub1" />
            <Picker.Item label="Sub-Area 2" value="sub2" />
            <Picker.Item label="Sub-Area 3" value="sub3" />
          </Picker>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          className="bg-orange-500 rounded-xl py-3 mb-4"
          onPress={handleSignup}
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <TouchableOpacity onPress={() => router.push("/citizenLogin")}>
          <Text className="text-orange-600 text-center text-base">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Signup;
