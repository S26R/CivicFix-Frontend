import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const IssueCard = ({ issue, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-100 rounded-xl p-4 mb-3 active:opacity-70"
    >
      <Text className="text-lg font-semibold text-gray-800">{issue.title}</Text>
      <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
        {issue.description}
      </Text>
      <Text className="text-xs text-gray-500 mt-2">Status: {issue.status}</Text>
    </TouchableOpacity>
  );
};

export default IssueCard;
