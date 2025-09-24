import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";

import { Animated } from "react-native";
import Constants from "expo-constants";

const AnimatedNumber = ({ value, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });
    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return <Text style={style}>{displayValue}</Text>;
};

const HomeAdmin = () => {
  const API_URL=Constants.expoConfig?.extra?.API_URL;
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citizenCount, setCitizenCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  useEffect(() => {
    if (user?.role !== "authority" || !token) {
      router.replace("/");
    }
  }, [user, token]);
  useEffect(() => {
    if (!token) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/api/authority/dashboard/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();
        setAnalytics(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCounts = async () => {
      try {
        const resCitizens = await fetch(
          `${API_URL}/api/authority/getAllcitizen`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataCitizens = await resCitizens.json();
        setCitizenCount(dataCitizens?.length || 0);  
          
        const resDepartments = await fetch(
          `${API_URL}/api/authority/getAlldepartment`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataDepartments = await resDepartments.json();
        setDepartmentCount(dataDepartments?.length || 0);
        
      } catch (err) {
        console.log("Error fetching user counts:", err);
      }
    };

    fetchCounts();
    fetchAnalytics();
  }, [token]);

  

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f4511e" />
        <Text className="mt-2 text-gray-500">Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  const total = analytics?.total || 0;
  const byStatus = analytics?.byStatus || {};

  const cards = [
    { title: "Total Reports", value: total, color: "blue", path: "/(Admin_dash)/TotalIssues" },
    { title: "Raised Reports", value: byStatus["raised"] || 0, color: "yellow", path: "/(Admin_dash)/RaisedIssues" },
    { title: "In Progress", value: byStatus["in-progress"] || 0, color: "orange", path: "/(Admin_dash)/InProgressIssues" },
    { title: "Assigned Reports", value: byStatus["assigned"] || 0, color: "purple", path: "/(Admin_dash)/AssignedIssues" },
    { title: "Resolved Reports", value: byStatus["resolved"] || 0, color: "green", path: "/(Admin_dash)/ResolvedIssues" },
    { title: "Rejected Reports", value: byStatus["rejected"] || 0, color: "red", path: "/(Admin_dash)/RejectedIssues" },
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold text-orange-600 mb-4">Reports Management</Text>

      <ScrollView
        className="bg-white flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(card.path)}
              className={`w-[48%] mb-4 bg-${card.color}-100 rounded-2xl p-4 shadow-md`}
            >
              <Text className="text-gray-500 text-sm">{card.title}</Text>
              <AnimatedNumber
                value={card.value}
                style={{ fontSize: 24, fontWeight: "bold", color: `${card.color}-700` }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-8">
          <Text className="text-2xl font-bold text-orange-600 mb-4">User Management</Text>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.push("/(Admin_dash)/Citizens")}
              className="flex-1 mx-1 bg-indigo-100 rounded-2xl border border-indigo-200 p-4 shadow-md"
            >
              <Text className="text-gray-500 text-sm">Active Citizens</Text>
              <AnimatedNumber
                value={citizenCount}
                style={{ fontSize: 24, fontWeight: "bold", color: "#3730a3" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(Admin_dash)/Departments")}
              className="flex-1 mx-1 bg-pink-100 rounded-2xl border border-pink-200 p-4 shadow-md"
            >
              <Text className="text-gray-500 text-sm">Active Departments</Text>
              <AnimatedNumber
                value={departmentCount}
                style={{ fontSize: 24, fontWeight: "bold", color: "#be185d" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeAdmin;
