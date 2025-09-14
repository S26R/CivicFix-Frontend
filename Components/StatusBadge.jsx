import { View, Text } from "react-native";
import React from "react";

// Status color map (centralized here)
const statusColors = {
  verifying: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
  raised: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  "in-progress": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  resolved: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  assigned: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
};

const StatusBadge = ({ status }) => {
  const scheme = statusColors[status] || statusColors.verifying;

  return (
    <View
      className={`self-start px-3 py-1 rounded-full border ${scheme.bg} ${scheme.border}`}
    >
      <Text className={`text-sm font-semibold ${scheme.text}`}>
        {status?.toUpperCase()}
      </Text>
    </View>
  );
};

export default StatusBadge;
