import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const Reports = () => {
  const { id } = useLocalSearchParams(); // ✅ get id from params

  return (
    <View>
      <Text>Reports Page</Text>
      <Text>Issue ID: {id}</Text>
    </View>
  );
};

export default Reports;
