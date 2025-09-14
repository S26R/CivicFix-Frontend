import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // dropdown for status
import { API_URL } from "@env";
import { useAuthStore } from "../../store/useAuthStore.js";
import StatusBadge from "../../Components/StatusBadge.jsx";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const ReportDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();
console.log("Report ID",id)
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Fetch issue by ID
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
         console.log(token)
        if (!res.ok) throw new Error("Failed to fetch issue");

        const data = await res.json();
        console.log(data)
        setIssue(data);
        setStatus(data.status); // default current status
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
    
      if (!res.ok) throw new Error("Failed to update status");
      Toast.show("Success", "Status updated successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update status");
    }
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

  return (
    <ScrollView className="flex-1 bg-orange-50 p-4">
      <View className="bg-white rounded-2xl p-4 shadow-lg border border-orange-200 mb-4">
        <Text className="text-2xl font-bold text-orange-600 mb-2">{issue.topic}</Text>
        <Text className="text-gray-700 mb-2">{issue.description}</Text>
        <Text className="text-gray-500 mb-2">Department: {issue.department}</Text>

        {/* Status */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Status:</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => updateStatus(itemValue)}
            className="bg-orange-100 rounded-lg"
          >
            <Picker.Item label="In Progress" value="in-progress" />
            <Picker.Item label="Resolved" value="resolved" />
            
          </Picker>
        </View>

        {/* Media */}
        {issue.media && issue.media.length > 0 && (
          <ScrollView horizontal className="mb-4">
            {issue.media.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.url }}
                className="w-48 h-32 rounded-xl mr-3 border border-orange-200"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Upvotes and Date */}
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <Ionicons name="arrow-up-circle" size={20} color="#f97316" />
            <Text className="ml-2 text-gray-800 font-medium">{issue.upvotes?.length || 0} Upvotes</Text>
          </View>
          <Text className="text-gray-500 text-sm">{formattedDate}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportDetails;
