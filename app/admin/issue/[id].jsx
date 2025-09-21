import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Constants from "expo-constants"
import { useAuthStore } from "../../../store/useAuthStore";
 import Toast from "react-native-toast-message";
 import { useRouter } from "expo-router";
const IssueDetails = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
    const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token, user } = useAuthStore(); // Get role from user
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIssue(data);
        setAssignee(data.assignedTo || "");
      } catch (err) {
        console.error("Error fetching issue details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, token]);






const handleAssign = async () => {
    setLoading(true);
  if (!assignee) {
    Toast.show({
      type: "error",
      text1: "Missing Department",
      text2: "Please select a department to assign",
    });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/authority/issues/${id}/assignIssue`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ departmentId: assignee }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to assign issue");
    }

    const updatedIssue = await res.json();
    setIssue(updatedIssue);

    // ✅ Toast instead of Alert
    Toast.show({
      type: "success",
      text1: "Assigned",
      text2: "Issue assigned successfully!",
    });
setLoading(false);
    // Redirect after a short delay
    setTimeout(() => {
      router.replace("/admin/TotalIssues");
    },1500)

  } catch (err) {
    console.error("Error assigning issue:", err);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: err.message || "Failed to assign issue",
    });
  }
};



  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-orange-600 text-lg">Loading issue details...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Issue not found.</Text>
      </View>
    );
  }

  const isAuthority = user?.role === "authority";

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="bg-orange-50 rounded-2xl border border-orange-200 shadow-lg p-4 mb-4">
        <Text className="text-2xl font-bold text-orange-600 mb-2">{issue.topic}</Text>
        <Text className="text-gray-700 mb-2">{issue.description}</Text>

        <Text className="text-sm text-gray-500 mb-1">
          Department: <Text className="font-semibold">{issue.department}</Text>
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          Status: <Text className="font-semibold">{issue.status}</Text>
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          Severity: <Text className="font-semibold">{issue.severity}</Text>
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          Uploaded By: <Text className="font-semibold">{issue.uploadedBy}</Text>
        </Text>

        {issue.location?.coordinates && (
          <Text className="text-sm text-gray-500 mb-2">
            Location:{" "}
            <Text className="font-semibold">
              Lat: {issue.location.coordinates[1]}, Lng: {issue.location.coordinates[0]}
            </Text>
          </Text>
        )}

        {issue.media && issue.media.length > 0 && (
          <ScrollView horizontal className="mb-3">
            {issue.media.map((m) => (
              <Image
                key={m._id}
                source={{ uri: m.url }}
                className="w-40 h-24 rounded-xl mr-2 border border-orange-300"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <Text className="text-sm text-gray-500 mb-2">
          Upvotes: <Text className="font-semibold">{issue.upvotes?.length || 0}</Text>
        </Text>

        <Text className="text-sm text-gray-500 mb-1">
          Assigned To: <Text className="font-semibold">{issue.assignedDepartment || "Not assigned"}</Text>
        </Text>

        {/* ONLY AUTHORITIES CAN ASSIGN */}
        {isAuthority && (
  <>
    <TextInput
      placeholder="Enter assignee ID"
      value={assignee}
      onChangeText={setAssignee}
      editable={!issue.assignedDepartment}   // ✅ disable if already assigned
      className={`border rounded-xl px-3 py-2 mb-3 text-black ${
        issue.assignedDepartment
          ? "border-gray-300 bg-gray-100 text-gray-500"
          : "border-orange-300"
      }`}
    />

    <TouchableOpacity
      onPress={handleAssign}
      disabled={!!issue.assignedDepartment}   // ✅ disable button
      className={`rounded-xl py-3 mb-2 ${
        issue.assignedDepartment
          ? "bg-gray-300"
          : "bg-orange-500"
      }`}
      activeOpacity={0.7}
    >
      <Text
        className={`text-center font-semibold ${
          issue.assignedDepartment ? "text-gray-600" : "text-white"
        }`}
      >
        {issue.assignedDepartment ? "Already Assigned" : "Assign Task"}
      </Text>
    </TouchableOpacity>
  </>
)}


        <Text className="text-xs text-gray-400 mt-2">
          Created At: {new Date(issue.createdAt).toLocaleString()}
        </Text>
        <Text className="text-xs text-gray-400">
          Last Updated: {new Date(issue.updatedAt).toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default IssueDetails;
