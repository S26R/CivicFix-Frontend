import { View, Text } from "react-native";
import React from "react";
import { TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const deptLogin = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    dept: "",
  });
    const handleChange = (key, value) => {
    setLoginData({ ...loginData, [key]: value });
  };
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View
        className="w-full bg-white rounded-2xl p-6 max-w-xl mt-2 mb-5"
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{
          shadowColor: "#FFA500",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Heading */}
        <Text className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login as Department
        </Text>

        {/* Email */}
                <Text className="text-orange-600 mb-1 font-semibold">Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginData.email}
                  onChangeText={(val) => handleChange("email", val)}
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

        {/* Sub-Area */}
        <Text className="text-orange-600 mb-1 font-semibold">Department</Text>
        <View className="border border-orange-300 rounded-xl mb-6 overflow-hidden">
          <Picker
            selectedValue={loginData.dept}
            onValueChange={(value) => handleChange("dept", value)}
            className="px-4 py-3 text-base"
          >
            <Picker.Item label="Select Department" value="" />
            <Picker.Item label="Electric" value="electric" />
            <Picker.Item label="Water" value="water" />
            <Picker.Item label="Pwc" value="pwc" />
          </Picker>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={() => {
            console.log("login pressed", loginData);
          }}
          className="bg-orange-500 rounded-xl py-3 mb-4"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default deptLogin;
