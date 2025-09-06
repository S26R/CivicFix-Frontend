import { View, Text } from 'react-native'
import { TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import React from 'react'

const citizenLogin = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
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
          Login as Citizen
        </Text>

        {/* Phone Number */}
        <Text className="text-orange-600 mb-1 font-semibold">Phone Number</Text>
        <TextInput
          placeholder="Enter phone number"
          value={loginData.phone}
          onChangeText={(val) => handleChange("phone", val)}
          keyboardType="phone-pad"
          maxLength={10}
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
          onPress={() => {console.log("login pressed",loginData)}}
          className="bg-orange-500 rounded-xl py-3 active:scale-95 transition-transform duration-200 mb-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        {/* Don't have an account? */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-orange-600 text-center text-base">
            Don’t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default citizenLogin