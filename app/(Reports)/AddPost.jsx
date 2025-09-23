import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { useAuthStore } from "../../store/useAuthStore";
import Toast from "react-native-toast-message";
import { Audio } from "expo-av";

const AddPost = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const router = useRouter();
  const { token } = useAuthStore();

  const [report, setReport] = useState({
    title: "",
    description: "",
    image: null,
    audio: null,
  });

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Audio states
  const [recording, setRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const timerRef = useRef(null);

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

  // Pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      quality: 0.7,
    });
    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // Take photo
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setReport((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Microphone access is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setRecordingDuration(0);

      // Start timer for 30s max
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Recording start error:", err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;
    clearInterval(timerRef.current);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setReport((prev) => ({ ...prev, audio: uri }));
    } catch (err) {
      console.error("Stop recording error:", err);
    } finally {
      setRecording(null);
      setRecordingDuration(0);
    }
  };

  // Play recorded audio
  const playAudio = async () => {
    if (!report.audio) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: report.audio });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Play audio error:", err);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    if (!report.title || !report.description) {
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
      formData.append("lat", location.coords.latitude);
      formData.append("lng", location.coords.longitude);

      // Image
      if (report.image) {
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

      // Audio
      if (report.audio) {
        const audioFile = {
          uri: report.audio,
          name: "voice.m4a",
          type: "audio/m4a",
        };
        formData.append("audio", audioFile);
      }

      const response = await fetch(`${API_URL}/api/issues/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Wohoo Report Created",
          text2: "Your voice makes a difference 💡",
        });
        router.push("/Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Sorry 🥺",
          text2: "Something went Wrong",
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
      Toast.show({
        type: "error",
        text1: "Sorry 🥺",
        text2: "Something went Wrong",
      });
    } finally {
      setIsLoading(false);
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
        <Text className="text-base font-semibold mb-2 text-orange-600">Title</Text>
        <TextInput
          className="border border-orange-400 rounded-2xl p-3 bg-white text-base mb-5 shadow-sm"
          placeholder="Enter report title"
          value={report.title}
          onChangeText={(text) => setReport((prev) => ({ ...prev, title: text }))}
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

        {/* Voice Recorder */}
        <Text className="text-base font-semibold mb-2 text-orange-600">
          Record Voice (max 30s)
        </Text>

        <View className="flex-row items-center mb-5">
          {!recording ? (
            <TouchableOpacity
              onPress={startRecording}
              className="bg-orange-500 px-4 py-3 rounded-2xl shadow-lg flex-row items-center justify-center flex-1 mr-2"
            >
              <Ionicons name="mic-outline" size={22} color="#fff" />
              <Text className="text-white font-semibold ml-2">Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={stopRecording}
              className="bg-red-500 px-4 py-3 rounded-2xl shadow-lg flex-row items-center justify-center flex-1 mr-2"
            >
              <Ionicons name="stop-circle-outline" size={22} color="#fff" />
              <Text className="text-white font-semibold ml-2">
                Stop ({recordingDuration}s)
              </Text>
            </TouchableOpacity>
          )}

          {report.audio && (
            <TouchableOpacity
              onPress={playAudio}
              className="bg-green-600 px-4 py-3 rounded-2xl shadow-lg flex-row items-center justify-center flex-1"
            >
              <Ionicons name="play-circle-outline" size={22} color="#fff" />
              <Text className="text-white font-semibold ml-2">Play</Text>
            </TouchableOpacity>
          )}
        </View>


        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`px-4 mb-4 py-4 rounded-2xl shadow-xl ${
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

        {/* Cancel */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-red-500 px-4 py-4 rounded-2xl shadow-lg mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddPost;
