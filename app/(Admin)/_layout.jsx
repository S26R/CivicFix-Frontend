
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";

const AdminLayout = () => {
  return (
    <Tabs
    screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#f4511e",
    }}
    >
        <Tabs.Screen
        name="home_admin"
        options={{
          title: "Home",
          headerTitle: "CivicFix",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerTitle: "CivicFix",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Department_management"
        options={{
          title: "Department Management",
          headerTitle: "CivicFix",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default AdminLayout