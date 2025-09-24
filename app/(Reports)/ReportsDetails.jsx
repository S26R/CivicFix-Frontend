import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import { Video } from "expo-av";

import { useAuthStore } from "../../store/useAuthStore.js";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import IssueMap from "../../Components/IssueMap.jsx";

const STATUS_FLOW = [
  "raised",
  "verifying",
  "assigned",
  "in-progress",
  "resolved",
];

const ReportDetails = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const { id } = useLocalSearchParams();
  const { token, user } = useAuthStore();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const index = Math.round(contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  // Fetch issue by ID
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch issue");
        const data = await res.json();

        setIssue(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load issue.");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchIssue();
  }, [token, id]);

  // Update status
  const updateStatus = async (newStatus) => {
    try {
      setStatus(newStatus);
      const res = await fetch(`${API_URL}/api/department/issues/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      res = JSON.parse(res);

      if (!res.ok) throw new Error("Failed to update status");
      Toast.show({
        type: "success",
        text1: "Status updated successfully!",
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  // Progress bar calculation
  const getProgress = (status) => {
    if (status === "rejected") return 1; // 100% red
    const index = STATUS_FLOW.indexOf(status);
    return index === -1 ? 0 : (index + 1) / STATUS_FLOW.length;
  };

  const getProgressColor = (status) => {
    if (status === "rejected") return "bg-red-500";
    if (status === "resolved") return "bg-green-600";
    return "bg-orange-500";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!issue) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Issue not found.</Text>
      </View>
    );
  }

  const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const progress = getProgress(status);
  const progressColor = getProgressColor(status);
  console.log("Issue lat", issue.location?.coordinates[0]);
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Media Holder */}
      {/* {issue.media && issue.media.length > 0 ? (
     <View
    
    className="mb-4  items-center justify-center  mt-4"
    contentContainerStyle={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10, // optional padding
    }}
  >
    {issue.media.map((item, index) => (
  <View
    key={index}
    className="w-96 h-80 bg-orange-100 rounded-xl mb-4 justify-center items-center border border-orange-400 "
  >
    {item.type.startsWith('image'||'Image') ? (
      <Image
        source={{ uri: item.url }}
        style={{ width: '100%', height: '100%', borderRadius:10 }}
        resizeMode="cover"
      />
    ) : item.type.startsWith('video') ? (
     <Video
    source={{ uri: item.url }}
    style={{ width: '100%', height: '100%', borderRadius: 10 }}
    resizeMode="cover"
    useNativeControls // Change this prop for clarity and correctness
/>
    ) : null}
  </View>
))}
  </View>
) : (
  <View className="w-full h-40 bg-orange-100 rounded-xl mb-4 justify-center items-center border border-orange-200">
    <Text className="text-gray-500">No images uploaded</Text>
  </View>
)} */}
      {/* Media Carousel */}
      {issue.media && issue.media.length > 0 ? (
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {issue.media.map((item, index) => (
              <View
                key={index}
                className="w-screen h-80 justify-center items-center"
              >
                {item.type.toLowerCase().startsWith("image") ? (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : item.type.toLowerCase().startsWith("video") ? (
                  <Video
                    source={{ uri: item.url }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                    shouldPlay
                    isMuted
                    isLooping
                  />
                ) : (
                  <Text className="text-gray-500">Unsupported Media</Text>
                )}
              </View>
            ))}
          </ScrollView>
          <View className="flex-row justify-center mt-2">
            {issue.media.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeIndex ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>
      ) : (
        <View className="w-full h-40 bg-orange-100 rounded-xl mb-4 justify-center items-center border border-orange-200">
          <Text className="text-gray-500">No media uploaded</Text>
        </View>
      )}

      {/* Participants */}
      <View className="flex-row items-center">
        {issue.participants.slice(0, 4).map((participant, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              router.push({
                pathname: "/participants",
                params: { participantId: participant.id },
              })
            }
          >
            <Image
              source={{ uri: participant.avatar }}
              className={`w-10 h-10 rounded-full border-2 border-white -ml-2`}
            />
          </TouchableOpacity>
        ))}
        {issue.participants.length > 4 && (
          <TouchableOpacity onPress={() => router.push("/Participants")}>
            <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center -ml-2">
              <Text className="text-xs text-gray-700">
                +{issue.participants.length - 4}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View className="p-4">
        {/* Topic */}
        <Text className="text-2xl font-bold text-orange-600 mb-1">
          {issue.topic}
        </Text>
        <Text className="text-sm font-bold text-orange-300 mb-1">
         Issue Id: {issue.issueId}
        </Text>
        {/* Uploaded BY */}
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-700 font-medium text-sm">
            Uploaded by :{" "}
            {issue.uploadedBy?.name || issue.uploadedBy?.email ||issue.userID || "Unknown"}
          </Text>
        </View>

        {/* Description */}
        <Text className="text-gray-700 mb-4">{issue.description}</Text>

        {/* Location */}
        {/* Location Placeholder */}
        {issue.location?.coordinates[0] && (
          <View className="h-80 mb-6 rounded-xl overflow-hidden">
            <IssueMap
              latitude={issue.location?.coordinates[1]}
              longitude={issue.location?.coordinates[0]}
            />
          </View>
        )}

        {/* Status Section */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Report Status
          </Text>

          {/* Progress Bar */}
          <View className="h-3 bg-gray-200 rounded-xl overflow-hidden">
            <View
              style={{ width: `${progress * 100}%` }}
              className={`h-3 ${progressColor}`}
            />
          </View>

          {/* Status + Upvotes */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-orange-600 font-medium capitalize">
              {status.replace("-", " ")}
            </Text>

            {/* Upvotes */}
            <View className="flex-row items-center">
              <Ionicons name="arrow-up-circle" size={20} color="#f97316" />
              <Text className="ml-1 text-gray-800 font-medium">
                {issue.upvotes?.length || 0} Upvotes
              </Text>
            </View>
          </View>
        </View>

        {/* Status Update (only for departments) */}
        {user?.role === "department" && (
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Change Status:</Text>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => updateStatus(itemValue)}
              className="bg-orange-100 rounded-lg"
            >
              {STATUS_FLOW.map((s) => (
                <Picker.Item key={s} label={s.replace("-", " ")} value={s} />
              ))}
              <Picker.Item label="Rejected" value="rejected" />
            </Picker>
          </View>
        )}

        {/* Date Info */}
        <View className="flex-row justify-between mt-4 mb-6">
          <View>
            <Text className="text-gray-400 text-sm">Submitted</Text>
            <Text className="text-gray-800 font-medium">{formattedDate}</Text>
          </View>
          <View>
            <Text className="text-gray-400 text-sm">Last Update</Text>
            <Text className="text-gray-800 font-medium">{formattedDate}</Text>
          </View>
        </View>

        {/* Participants */}
        {issue.participants?.length > 0 && (
          <View className="bg-orange-50 p-3 rounded-xl border border-orange-200 mb-4">
            <Text className="font-semibold text-orange-600 mb-2">
              Participants Joined:
            </Text>
            {issue.participants.map((p, idx) => (
              <Text key={idx} className="text-gray-700">
                • {p.email}
              </Text>
            ))}
          </View>
        )}

        {/* Issue Location Map */}

        {/* Edit / Close Request */}
        <View className="flex-row justify-between mb-8 mt-4">
          <TouchableOpacity
            onPress={() => router.push(`/edit-issue/${id}`)}
            className="flex-1 bg-orange-500 p-4 rounded-xl mr-2 items-center"
          >
            <Text className="text-white font-semibold">Edit Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Confirm",
                "Are you sure you want to close this request?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Close",
                    style: "destructive",
                    onPress: () => updateStatus("resolved"),
                  },
                ]
              )
            }
            className="flex-1 bg-red-500 p-4 rounded-xl ml-2 items-center"
          >
            <Text className="text-white font-semibold">Close Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportDetails;
