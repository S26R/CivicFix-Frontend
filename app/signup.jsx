import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    aadhaar: "",
    phone: "",
    email: "",
    municipality: "",
    ward: "",
    subArea: "",
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      {/* Signup Card with orange shadow */}
      <ScrollView
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
          Create Account
        </Text>

        {/* Name */}
        <Text className="text-orange-600 mb-1 font-semibold">Name</Text>
        <TextInput
          placeholder="Enter your name"
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />

        

        {/* Phone Number */}
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

        {/* Aadhaar Number */}
        <Text className="text-orange-600 mb-1 font-semibold">
          Aadhaar Number
        </Text>
        <TextInput
          placeholder="Enter Aadhaar Number"
          keyboardType="number-pad"
          maxLength={12}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.aadhaar}
          onChangeText={(value) => handleChange("aadhaar", value)}
        />

        {/* Municipality */}
        <Text className="text-orange-600 mb-1 font-semibold">Municipality</Text>
        <TextInput
          placeholder="Enter municipality"
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.municipality}
          onChangeText={(value) => handleChange("municipality", value)}
        />

        {/* Ward Number */}
        <Text className="text-orange-600 mb-1 font-semibold">Ward Number</Text>
        <TextInput
          placeholder="Enter ward number"
          keyboardType="number-pad"
          maxLength={3}
          className="border border-orange-300 rounded-xl px-4 py-3 mb-4 text-base"
          placeholderTextColor="#fb923c"
          value={formData.ward}
          onChangeText={(value) => handleChange("ward", value)}
        />

        {/* Sub-Area */}
        <Text className="text-orange-600 mb-1 font-semibold">Sub-Area</Text>
        <View className="border border-orange-300 rounded-xl mb-6 overflow-hidden">
          <Picker
            selectedValue={formData.subArea}
            onValueChange={(value) => handleChange("subArea", value)}
            className="px-4 py-3 text-base"
          >
            <Picker.Item label="Select Sub-Area" value="" />
            <Picker.Item label="Sub-Area 1" value="sub1" />
            <Picker.Item label="Sub-Area 2" value="sub2" />
            <Picker.Item label="Sub-Area 3" value="sub3" />
          </Picker>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          className="bg-orange-500 rounded-xl py-3 active:scale-95 transition-transform duration-200 mb-4"
          onPress={() => console.log("Signup pressed", formData)}
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

export default signup;
