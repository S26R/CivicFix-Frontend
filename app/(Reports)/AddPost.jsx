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
  Modal,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Constants from "expo-constants"
import { useAuthStore } from "../../store/useAuthStore";
import Toast from "react-native-toast-message";

const AddPost = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const router = useRouter();
  const { token } = useAuthStore();

  const [report, setReport] = useState({
    title: "",
    description: "",
    department: "",
    image: null,
  });

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // NEW states for modal handling
  const [modalVisible, setModalVisible] = useState(false);
  const [nearbyIssue, setNearbyIssue] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
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

  // ---------------- Submit ----------------
  const handleSubmit = async (extra = {}) => {
    if (!report.title || !report.description || !report.department) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }
    if (!location) {
      Alert.alert("Location Error", "Could not get location.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("topic", report.title);
      formData.append("description", report.description);
      formData.append("department", report.department);
      formData.append("lat", location.coords.latitude);
      formData.append("lng", location.coords.longitude);

      if (extra.joinExisting !== undefined) {
        formData.append("joinExisting", extra.joinExisting);
      }

      if (report.image) {
        if (Platform.OS === "web" && report.image.startsWith("blob:")) {
          // ✅ Web: convert blob URL to File
          const response = await fetch(report.image);
          const blob = await response.blob();
          const file = new File([blob], "photo.jpg", { type: blob.type });
          formData.append("media", file);
        } else {
          // ✅ Native: use file:// uri
          const fileUri = report.image.startsWith("file://")
            ? report.image
            : `file://${report.image}`;
          const fileObject = {
            uri: fileUri,
            name: "photo.jpg",
            type: "image/jpeg",
          };
          formData.append("media", fileObject);
        }
      }

      const response = await fetch(`${API_URL}/api/issues/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.similarFound) {
        Toast.show({ type: "success", text1: "Similar Issue Detected", text2: "Found a Similar Issue Nearby" });
        setNearbyIssue(data.nearbyIssue);
        setModalVisible(true);
        return;
      }
      //response=JSON.parse(response);
      if (response.ok) {
        Toast.show({ type: "success", text1: "Wohoo Report Created", text2: "Your voice makes a difference 💡" });
        router.push("/(DashBoard)/Home");
      } else {
        Toast.show({type:"error",text1:"Sorry 🥺",text2:"Something went Wrong"})
      }
    } catch (err) {
      console.error("Submit error:", err);
      Toast.show({type:"error",text1:"Sorry 🥺",text2:"Something went Wrong"})
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- Modal Actions ----------------
  const handleJoin = () => {
    setModalVisible(false);
    handleSubmit({ joinExisting: true });
  };

  const handleCreateNew = () => {
    setModalVisible(false);
    handleSubmit({ joinExisting: false });
  };

  const handleUpvote = async () => {
    setModalVisible(false);
    try {
      const res = await fetch(`${API_URL}/api/issues/${nearbyIssue._id}/upvote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (res.ok) {
        Toast.show({type:"success",text1:"Upvoted!",text2: "You upvoted the existing issue.👌"});
        router.push("/(DashBoard)/Home");
      } else {
        Toast.show({type:"error",text1:"Sorry 🥺",text2:"Something went Wrong"})
      }
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  // ---------------- UI ----------------
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <ScrollView
        className="w-full bg-white p-5 max-w-xl rounded-2xl my-4"
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
        <Text className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Submit a Report
        </Text>

        {/* Image Section */}
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
            <Ionicons name="folder-open-outline" size={22} color="#fff" />
            <Text className="text-white text-center font-semibold">Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhoto}
            className="bg-orange-500 px-4 py-3 rounded-2xl flex-1 ml-2 shadow-lg flex-row justify-center items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={22} color="#fff" />
            <Text className="text-white text-center font-semibold">Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
          Title
        </Text>
        <TextInput
          className="border border-orange-400 rounded-2xl p-3 bg-white text-base mb-5 shadow-sm"
          placeholder="Enter report title"
          value={report.title}
          onChangeText={(text) =>
            setReport((prev) => ({ ...prev, title: text }))
          }
        />

        {/* Description */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
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
            <Picker.Item label="Animal Control" value="Animal Control Department" />
            <Picker.Item label="General" value="General Department" />
          </Picker>
        </View>

        {/* Cancel + Submit */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 px-4 py-4 rounded-2xl shadow-lg mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`px-4 py-4 rounded-2xl shadow-xl ${
            isLoading ? "bg-green-300" : "bg-green-600"
          }`}
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

      {/* 🔥 Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-xl">
            <Text className="text-xl font-bold text-center text-orange-600 mb-4">
              Nearby Issue Found
            </Text>
            {nearbyIssue && (
              <Text className="text-gray-700 mb-3 text-center">
                "{nearbyIssue.topic}" already exists within 12m in{" "}
                {nearbyIssue.department}.
              </Text>
            )}

            <TouchableOpacity
              className="bg-green-600 py-3 rounded-xl mb-3"
              onPress={handleJoin}
            >
              <Text className="text-white text-center font-semibold">Join Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-600 py-3 rounded-xl mb-3"
              onPress={handleUpvote}
            >
              <Text className="text-white text-center font-semibold">Upvote Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-orange-600 py-3 rounded-xl"
              onPress={handleCreateNew}
            >
              <Text className="text-white text-center font-semibold">
                Create New Issue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddPost;
