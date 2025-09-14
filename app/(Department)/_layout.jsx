
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";

const DepartmentLayout = () => {
  return (
    <Tabs
    initialRouteName='DepartmentHome'
    screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#f4511e",
    }}

    >
       <Tabs.Screen
    name="DepartmentHome"
  options={{
    title: "Department Home",
    headerTitle: "CivicFix",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
  }}
/>

<Tabs.Screen
  name="DepartmentProfile"
  options={{
    title: "Profile",
    headerTitle: "CivicFix",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
  }}
/>

      
    </Tabs>
  )
}

export default DepartmentLayout