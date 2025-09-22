import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import Constants from "expo-constants";

const IssueCard = ({ issue, onPress }) => {
  const GOOGLE_MAPS_API_KEY =
    Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY; // ✅ use Google key
  const createdAt = new Date(issue.createdAt);
  const formattedDate = createdAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!issue?.location?.coordinates) return; // expect [lng, lat]

      try {
        const [lng, lat] = issue.location.coordinates;

        // ✅ Google reverse geocoding API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          // Use the most readable address (short form)
          setAddress(data.results[0].formatted_address);
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    };

    fetchAddress();
  }, [issue?.location?.coordinates]);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl bg-orange-50 shadow-lg border border-orange-200 p-4 mb-3 active:opacity-70"
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
            {issue.topic || issue.title}
          </Text>

          <Text className="text-gray-600 mb-2" numberOfLines={2}>
            {issue.description}
          </Text>

          {/* 🆕 Nearby address */}
          {address && (
            <Text className="text-sm text-gray-700 italic mb-2">📍 {address}</Text>
          )}

          <Text className="text-sm text-gray-500 mb-2">
            {issue.department}
          </Text>

          <StatusBadge status={issue.status} />
        </View>

        {/* Right: Media preview */}
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
          <Ionicons name="arrow-up-circle" size={20} color="#f97316" />
          <Text className="ml-2 text-gray-800 font-medium">
            {issue.upvotes?.length || 0} Upvotes
          </Text>
        </View>

        <View>
          <Text className="text-xs text-gray-500">{formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IssueCard;
