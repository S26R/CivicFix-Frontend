
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";


const DashLayout = () => {
  return (
    <Tabs
    screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#f4511e",
    }}
    >
    <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerTitle: "CivicFix",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyReports"
        options={{
          title: "Reports",
          headerTitle: "My Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default DashLayout