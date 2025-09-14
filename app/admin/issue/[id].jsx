import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "@env";
const IssueDetails = () => {
  const { id } = useLocalSearchParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(`${API_URL}/api/issues/${id}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        });
        const data = await res.json();
        setIssue(data);
      } catch (err) {
        console.log("Error fetching issue details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="orange" />
        <Text className="mt-2 text-gray-600">Loading issue details...</Text>
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

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-orange-600 mb-3">{issue.title}</Text>
      <Text className="text-base text-gray-700 mb-4">{issue.description}</Text>
      <Text className="text-sm text-gray-600 mb-2">Status: {issue.status}</Text>
      <Text className="text-sm text-gray-600 mb-2">
        Reported At: {new Date(issue.createdAt).toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-600 mb-2">
        Assigned To: {issue.assignedTo || "Not assigned"}
      </Text>
    </ScrollView>
  );
};

export default IssueDetails;
