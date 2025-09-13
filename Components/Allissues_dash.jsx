import { View, Text } from "react-native";
import React from "react";
import { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Allissues_dash = ({button=true}) => {
  const router = useRouter();
  const [QueryData, setQueryData] = useState({
    issues: [
      {
        _id: "68bbb7be758de3782106958b",
        topic: "Burst water pipeline",
        description: "Water flooding near central road",
        location: {
          type: "Point",
          coordinates: [88.3645, 22.5731],
        },
        upvotes: 12,
        severity: "critical",
        status: "resolved",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.288Z",
        updatedAt: "2025-09-06T04:25:34.288Z",
        distance: 83.07661677735028,
        proximityFactor: 0.98338467664453,
        upvoteFactor: 0.12,
        recencyFactor: 0.9999182012623659,
        severityFactor: 1,
        score: 0.6429990432458321,
      },
      {
        _id: "68bbb7be758de3782106958c",
        topic: "Major traffic light failure",
        description: "Signal not working at busy junction",
        location: {
          type: "Point",
          coordinates: [88.39, 22.57],
        },
        upvotes: 50,
        severity: "critical",
        status: "in-progress",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.292Z",
        updatedAt: "2025-09-06T04:25:34.292Z",
        distance: 2698.440755333826,
        proximityFactor: 0.46031184893323485,
        upvoteFactor: 0.5,
        recencyFactor: 0.9999182151501187,
        severityFactor: 1,
        score: 0.6380771977099943,
      },
      {
        _id: "68bbb7be758de3782106958d",
        topic: "Garbage overflow near market",
        description: "Bin overflowing, bad smell",
        location: {
          type: "Point",
          coordinates: [88.37, 22.575],
        },
        upvotes: 20,
        severity: "moderate",
        status: "raised",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.292Z",
        updatedAt: "2025-09-06T04:25:34.292Z",
        distance: 681.5658217670716,
        proximityFactor: 0.8636868356465857,
        upvoteFactor: 0.2,
        recencyFactor: 0.9999182151501187,
        severityFactor: 0.6,
        score: 0.5990896937239996,
      },
      {
        _id: "68bbb7be758de3782106958f",
        topic: "Pothole in residential lane",
        description: "Causing two-wheeler accidents",
        location: {
          type: "Point",
          coordinates: [88.365, 22.572],
        },
        upvotes: 5,
        severity: "minor",
        status: "rejected",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.292Z",
        updatedAt: "2025-09-06T04:25:34.292Z",
        distance: 131.32409146884316,
        proximityFactor: 0.9737351817062314,
        upvoteFactor: 0.05,
        recencyFactor: 0.9999182151501187,
        severityFactor: 0.3,
        score: 0.5421041975418932,
      },
      {
        _id: "68bbb7be758de3782106958e",
        topic: "School boundary wall broken",
        description: "Unsafe for children",
        location: {
          type: "Point",
          coordinates: [88.38, 22.571],
        },
        upvotes: 8,
        severity: "moderate",
        status: "assigned",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.292Z",
        updatedAt: "2025-09-06T04:25:34.292Z",
        distance: 1664.5037486532274,
        proximityFactor: 0.6670992502693545,
        upvoteFactor: 0.08,
        recencyFactor: 0.9999182151501187,
        severityFactor: 0.6,
        score: 0.4921134181108301,
      },
      {
        _id: "68bbb7be758de37821069590",
        topic: "Broken public bench in park",
        description: "Metal frame sticking out",
        location: {
          type: "Point",
          coordinates: [88.4, 22.58],
        },
        upvotes: 15,
        severity: "minor",
        status: "in-progress",
        __v: 0,
        createdAt: "2025-09-06T04:25:34.293Z",
        updatedAt: "2025-09-06T04:25:34.293Z",
        distance: 3800.9974300254153,
        proximityFactor: 0.23980051399491698,
        upvoteFactor: 0.15,
        recencyFactor: 0.999918218622057,
        severityFactor: 0.3,
        score: 0.36192379792288654,
      },
    ],
  });

  const statusColors = {
    verifying: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
    raised: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
    "in-progress": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
    resolved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
    assigned: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  };


  const handleUpvote = (id) => {
    const updated = QueryData.issues.map((issue) =>
      issue._id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    );
    setQueryData({ issues: updated });
  };
  return (
    <View className="flex-1 bg-white">
    <View
      className="flex-1 p-4 m-2 bg-white rounded-2xl shadow-lg border border-orange-200"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text className="text-2xl font-bold text-orange-600 mb-6">Reported Issues</Text>

      {QueryData.issues.map((issue) => {
        const colorScheme = statusColors[issue.status] || statusColors.verifying;

        return (
          <TouchableOpacity key={issue._id} activeOpacity={0.9}
            onPress={() => {router.push({pathname:"/ReportsDetails",params:{id:issue._id}})}}>
          <View
            key={issue._id}
            className="mb-5 rounded-2xl bg-orange-50 p-4 border border-orange-200"
            style={{
              shadowColor: "#f97316",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            {/* Title */}
            <Text className="text-lg font-semibold text-gray-900 mb-1">{issue.topic}</Text>

            {/* Description */}
            <Text className="text-gray-600 mb-3">{issue.description}</Text>

            {/* Status Badge */}
            <View
              className={`self-start px-3 py-1 rounded-full border ${colorScheme.bg} ${colorScheme.border} mb-3`}
            >
              <Text className={`text-sm font-semibold ${colorScheme.text}`}>
                {issue.status.toUpperCase()}
              </Text>
            </View>

            {/* Upvote Section */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="arrow-up-circle" size={22} color="#f97316" />
                <Text className="ml-2 text-gray-800 font-medium">{issue.upvotes} Upvotes</Text>
              </View>

              {button && (
                <TouchableOpacity
                  onPress={() => handleUpvote(issue._id)}
                  activeOpacity={0.7}
                  className="bg-orange-500 px-4 py-2 rounded-lg shadow-md"
                >
                  <Text className="text-white font-semibold">Upvote</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
  );
}

export default Allissues_dash;
