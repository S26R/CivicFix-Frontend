import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const AddPost = () => {
  const router = useRouter();
  const [report, setReport] = useState({
    title: "",
    description: "",
    department: "",
    image: null,
  });

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType, // FIX: Specify .Images to only allow images
      quality: 0.7,
    });
    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSubmit = async () => {
    if (!report.title || !report.description || !report.department) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }
    if (!location) {
      Alert.alert("Location Error", "Could not determine location. Please ensure location services are enabled.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "You are not logged in.");
        router.push("/citizenLogin");
        return;
      }
      
      const formData = new FormData();

      formData.append("topic", report.title);
      formData.append("description", report.description);
      formData.append("department", report.department);
      formData.append("lat", location.coords.latitude);
      formData.append("lng", location.coords.longitude);

      if (report.image) {
        // --- FIX: More Robust File Handling ---
        // The previous logic for guessing the file type was unreliable.
        // Hardcoding a generic but valid filename and a common type like 'image/jpeg' is much more robust.
        // The server and Cloudinary are smart enough to correctly identify the actual file type from its content.
        const fileObject = {
          uri: report.image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        };

        // For debugging, you can log this object to see what's being sent
        console.log("Appending File:", fileObject);
        
        formData.append("media", fileObject);
      }

      const response = await fetch(`${API_URL}/api/issues/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Report submitted successfully!");
        router.push("/dashboard");
      } else {
        Alert.alert("Submission Failed", responseData.msg || responseData.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "An error occurred while submitting the report. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
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
        {/* The rest of your UI remains the same */}
        <Text className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Submit a Report
        </Text>
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
            <Picker.Item
              label="Roads & Infrastructure"
              value="Roads & Infrastructure Department"
            />
            <Picker.Item
              label="Street Lighting & Electricity"
              value="Street Lighting & Electricity Department"
            />
            <Picker.Item
              label="Water Supply & Drainage"
              value="Water Supply & Drainage Department"
            />
            <Picker.Item
              label="Sanitation & Waste Management"
              value="Sanitation & Waste Management Department"
            />
            <Picker.Item
              label="Public Safety & Transport"
              value="Public Safety & Transport Department"
            />
            <Picker.Item
              label="Parks & Public Spaces"
              value="Parks & Public Spaces Department"
            />
            <Picker.Item
              label="Pollution Control"
              value="Pollution Control Department"
            />
            <Picker.Item
              label="Animal Control"
              value="Animal Control Department"
            />
            <Picker.Item label="General" value="General Department" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 px-4 py-4 rounded-2xl shadow-slate-400 shadow-lg mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`px-4 py-4 rounded-2xl shadow-xl ${isLoading ? 'bg-green-300' : 'bg-green-600'}`}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Submit Report
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddPost;