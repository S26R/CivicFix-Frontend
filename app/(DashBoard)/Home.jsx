import { View, Text, Pressable } from "react-native";
import React from "react";
import MyReports_dash from "../../Components/MyReports_dash";
import Allissues_dash from "../../Components/Allissues_dash";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const Home = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const onPress = () => {
    router.push("/AddPost");
  };
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <Pressable
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        className={`flex-row items-center justify-center mx-2 mt-2 px-5 py-3 rounded-xl shadow-md ${
          isHovered ? "bg-orange-600" : "bg-orange-500"
        }`}
      >
        <Text className="text-white font-semibold text-lg">Report Issue  </Text>

        <Ionicons
          name="add-circle"
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
      </Pressable>
      <ScrollView
        className="bg-white flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
            router.push("/MyReports");
          }}
        >
          <MyReports_dash>3</MyReports_dash>
        </Pressable>
        <Allissues_dash />
      </ScrollView>
    </View>
  );
};

export default Home;
