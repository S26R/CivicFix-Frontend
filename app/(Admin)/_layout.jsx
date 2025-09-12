
import React from 'react'
import { Tabs } from 'expo-router'

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
        name="Home_Admin"
        options={{
          title: "Home",
          headerTitle: "CivicFix-Admin",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default AdminLayout