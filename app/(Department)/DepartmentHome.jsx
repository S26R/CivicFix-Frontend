
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";
import { useAuthStore } from "../../store/useAuthStore.js"; // adjust path
import { useRouter } from "expo-router";
import StatusBadge from "../../Components/StatusBadge.jsx";
import { ScrollView } from "react-native";


export default function DepartmentHome(link = true) {
  const router = useRouter();
  const { token } = useAuthStore();
  
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchIssues = async () => {
        try {
          setLoading(true);
  
          const res = await fetch(`${API_URL}/api/department/issues`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!res.ok) throw new Error("Failed to fetch issues");
  
          const data = await res.json();
          console.log("Fetched issues:", data.issues);
          setIssues(data.issues);
        } catch (err) {
          console.error("Error fetching my issues:", err);
        } finally {
          setLoading(false);
        }
      };
  
      if (token) {
        fetchIssues();
      }
    }, [token]);
  
    if (loading) {
      return (
        <View className="p-4">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      );
    }
  return (
    <ScrollView className="rounded-2xl bg-orange-50 shadow-lg border border-orange-200 m-2">
    <View className="bg-white p-4 rounded-lg">
      <Text className="text-2xl font-bold text-orange-600 mb-6">
        Welcome to Department Dashboard
      </Text>

      {issues.length === 0 ? (
        <Text className="text-gray-500">No reports yet.</Text>
      ) : (
        issues.map((issue) => {
        
          const createdAt = new Date(issue.createdAt);
          const formattedDate = createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <TouchableOpacity
              key={issue._id}
              onPress={() =>
                router.push({
                  pathname: "/ReportsDetails",
                  params: { id: issue._id },
                })
              }
              disabled={!link}
            >
              <View
                className="mb-3 rounded-2xl bg-orange-50 p-3 border border-orange-200"
                style={{
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <View className="flex-row justify-between items-start">
                  {/* Left: Title, Description, Department, Status */}
                  <View className="flex-1 pr-3">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {issue.topic}
                    </Text>
                    <Text>
                        {issue._id}
                    </Text>
                    <Text className="text-gray-600 mb-2">
                      {issue.description}
                    </Text>

                    <Text className="text-sm text-gray-500 mb-2">
                      {issue.department}
                    </Text>

                    {/* Status Badge */}
                    <View
                      
                    >
                      <StatusBadge status={issue.status} />
                    </View>
                  </View>

                  {/* Right: Image + Date */}
                  <View className="items-end">
                    {issue.media && issue.media.length > 0 && (
                      <Image
                        source={{ uri: issue.media[0].url }}
                        className="w-32 h-20 rounded-xl mb-2 border border-orange-200"
                        resizeMode="cover"
                      />
                    )}
                    
                  </View>
                </View>

                {/* Upvotes */}
                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-row items-center">

                  <Ionicons name="arrow-up-Circle" size={20} color="#f97316" />
                  <Text className="ml-2 text-gray-800 font-medium">
                    {issue.upvotes?.length || 0} Upvotes
                  </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500">
                      {formattedDate}
                    </Text>
                  </View>
                </View>
                
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  </ScrollView>
  )
}