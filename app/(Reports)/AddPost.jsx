import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AddPost = () => {
  const router = useRouter();
  const [report, setReport] = useState({
    title: "",
    description: "",
    department: "",
    image: null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // 📸 Take photo
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // 🚀 Submit
  const handleSubmit = () => {
    if (!report.title || !report.description || !report.department) {
      alert("Please fill all fields");
      return;
    }

    console.log("Report Submitted:", report);
    alert("Report submitted!");
    router.push({ pathname: "/ReportsDetails", params: { id: "new" } }); //id to be added from backend ba unique lagiye

    // reset
    setReport({
      title: "",
      description: "",
      department: "",
      image: null,
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <ScrollView
        className="w-full bg-white p-5 max-w-xl rounded-2xl my-4 "
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
        {/* Header */}
        <Text className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Submit a Report
        </Text>

        {/* Image Upload */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
          Upload Image
        </Text>
        <View className="h-48 border border-orange-400 rounded-2xl mb-5 items-center justify-center bg-gray-50 shadow-inner">
          {report.image ? (
            <Image
              source={{ uri: report.image }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-gray-500">No image selected</Text>
          )}
        </View>

        {/* Image Buttons */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={pickImage}
            className="bg-orange-500 px-4 py-3 rounded-2xl flex-1 mr-2 shadow-lg flex-row justify-center items-center"
            activeOpacity={0.7}
          >
            <Ionicons
              className="w-7"
              name="folder-open-outline"
              size={22}
              color="#fff"
            />
            <Text className="text-white text-center font-semibold">
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhoto}
            className="bg-orange-500 px-4 py-3 rounded-2xl flex-1 ml-2 shadow-lg flex-row justify-center items-center"
            activeOpacity={0.7}
          >
            <Ionicons
              className="w-7"
              name="camera-outline"
              size={22}
              color="#fff"
            />
            <Text className="text-white text-center font-semibold">Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
          Title
        </Text>
        <TextInput
          className="border border-orange-400 rounded-2xl p-3 bg-white text-base mb-5 shadow-sm focus:border-orange-600"
          placeholder="Enter report title"
          value={report.title}
          onChangeText={(text) =>
            setReport((prev) => ({ ...prev, title: text }))
          }
        />

        {/* Description */}
        <Text className="text-base font-semibold mb-2 text-orange-600 justify-items-start">
          Description
        </Text>
        <TextInput
          className="border border-orange-400 rounded-2xl p-3 bg-white text-base mb-5 h-32 shadow-sm"
          placeholder="Describe the issue..."
          value={report.description}
          onChangeText={(text) =>
            setReport((prev) => ({ ...prev, description: text }))
          }
          multiline
        />

        {/* Department */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
          Department
        </Text>
        <View className="border border-orange-400 rounded-2xl px-2 py-2 bg-white mb-5 shadow-sm">
          <Picker
            selectedValue={report.department}
            onValueChange={(val) =>
              setReport((prev) => ({ ...prev, department: val }))
            }
          >
            <Picker.Item label="Select Department" value="" />
            <Picker.Item label="Water Supply" value="water" />
            <Picker.Item label="Traffic" value="traffic" />
            <Picker.Item label="Sanitation" value="sanitation" />
            <Picker.Item label="Public Works" value="public-works" />
            <Picker.Item label="Education" value="education" />
          </Picker>
        </View>
        {/* cancel */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 px-4 py-4 rounded-2xl shadow-slate-400 shadow-lg mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 px-4 py-4 rounded-2xl shadow-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center font-bold text-lg">
             Submit Report
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddPost;
