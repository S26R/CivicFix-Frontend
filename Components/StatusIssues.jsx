import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { API_URL } from "@env";

import { useAuthStore } from "../store/useAuthStore";
import IssueCard from "./IssueCard";


const StatusIssues = ({ status, title }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/authority/issues?status=${status}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(`Fetched ${status} issues:`, data);
        setIssues(data.issues || []);
      } catch (err) {
        console.log(`Error fetching ${status} issues:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [status]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="orange" />
        <Text className="mt-2 text-gray-600">Loading {title}...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-orange-600 mb-4">{title}</Text>

      <FlatList
        data={issues}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => router.push(`/id?id=${item._id}`)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No {title.toLowerCase()} found
          </Text>
        }
      />
    </View>
  );
};

export default StatusIssues;
