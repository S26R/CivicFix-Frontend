
import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '../../store/useAuthStore';


const DashLayout = () => {
   const loadToken = useAuthStore((state) => state.loadToken);
  
    useEffect(() => {
      // ✅ load token + user when tabs layout mounts
      loadToken();
    }, []);
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
       <Tabs.Screen
              name="Profile"
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

export default DashLayout