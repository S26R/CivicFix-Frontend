import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../store/useAuthStore.js"; // adjust path
import Constants from "expo-constants"
import StatusBadge from "./StatusBadge.jsx";

const MyReports_dash = ({ router, n = 3, link = false, refreshing, setRefreshing }) => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const { token, user } = useAuthStore();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState({}); // cache by issueId

  // 🔹 Helper: reverse geocode with timeout
  const fetchAddress = async (lat, lng, issueId) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: { "User-Agent": "CivicFix/1.0" },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new Error("Geocode failed");
      const geoData = await res.json();

      let displayAddress =
        geoData.address?.road ||
        geoData.address?.village ||
        geoData.address?.town ||
        geoData.address?.city ||
        geoData.display_name?.split(",")[0] ||
        "Unknown area";

      setAddresses((prev) => ({ ...prev, [issueId]: displayAddress }));
    } catch (err) {
      clearTimeout(timeout);
      console.log("Geocoding error:", err.message);
      setAddresses((prev) => ({ ...prev, [issueId]: "Unknown area" }));
    }
  };

  // 🔹 Fetch issues function (extracted for reuse)
  const fetchIssues = async () => {
    try {
     // setLoading(true);
      if (!user?.id) return;

      const res = await fetch(`${API_URL}/api/issues/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch issues");

      const data = await res.json();
      setIssues(data);

      // Clear addresses cache for fresh geocoding
      setAddresses({});

      // Start geocoding individually in background
      data.forEach((issue) => {
        if (issue.location?.coordinates?.length === 2) {
          const [lng, lat] = issue.location.coordinates;
          fetchAddress(lat, lng, issue._id);
        }
      });
    } catch (err) {
      console.error("Error fetching my issues:", err);
    } finally {
      //setLoading(false);
      // Notify parent that refresh is complete
      if (setRefreshing) {
        setRefreshing(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (token && user) {
      fetchIssues();
    }
  }, [token, user]);

  // Handle refresh from parent
  useEffect(() => {
    if (refreshing && token && user) {
      fetchIssues();
    }
  }, [refreshing, token, user]);

  // if (loading) {
  //   return (
  //     <View className="p-4">
  //       <ActivityIndicator size="large" color="#f9" />
  //     </View>
  //   );
  // }

  return (
    <View className="rounded-2xl bg-orange-50 shadow-lg border border-orange-200 m-2">
      <View className="bg-white p-4 rounded-lg">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-orange-600">
            My Top Reports
          </Text>
          {refreshing && (
            <ActivityIndicator size="small" color="#f97316" />
          )}
        </View>

        {issues.length === 0 ? (
          <View className="text-center">
            <Text className="text-gray-500 mb-2">No reports yet.</Text>
            <Text className="text-xs text-gray-400">Pull down to refresh</Text>
          </View>
        ) : (
          issues.slice(0, n).map((issue) => {
            const createdAt = new Date(issue.createdAt);
            const formattedDate = createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const displayAddress =
              addresses[issue._id] || "Loading address…";

            return (
              <TouchableOpacity
                key={issue._id}
                onPress={() =>
                  router.push({
                    pathname: "/(Reports)/ReportsDetails",
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

                      <Text className="text-gray-600 mb-2" numberOfLines={2}>
                        {issue.description}
                      </Text>

                      {/* Nearby address */}
                      <Text className="text-sm text-gray-700 mb-1">
                        📍 {displayAddress}
                      </Text>

                      <Text className="text-sm text-gray-500 mb-2">
                        {issue.department}
                      </Text>

                      <StatusBadge status={issue.status} />
                    </View>

                    {/* Right: Image */}
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

                  {/* Upvotes + Date */}
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="arrow-up-circle"
                        size={20}
                        color="#f97316"
                      />
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
    </View>
  );
};

export default MyReports_dash;
