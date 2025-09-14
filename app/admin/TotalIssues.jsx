import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { API_URL } from "@env";
import IssueCard from "../../Components/IssueCard";
import { useAuthStore } from "../../store/useAuthStore";
const TotalIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuthStore();
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`${API_URL}/api/authority/allIssues`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        });
        const data = await res.json();
        console.log("Fetched issues:", data);
        setIssues(data);
      } catch (err) {
        console.log("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="orange" />
        <Text className="mt-2 text-gray-600">Loading issues...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-orange-600 mb-4">All Issues</Text>

      <FlatList
        data={issues}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => router.push(`/admin/issue/${item._id}`)}
          />
        )}
      />
    </View>
  );
};

// Fix header title
export const unstable_settings = {
  headerTitle: "Total Issues", // This will show in the header instead of Admin/TotalIssues
};

export default TotalIssues;
