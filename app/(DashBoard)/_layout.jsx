
import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '../../store/useAuthStore';


const DashLayout = () => {

   const loadToken = useAuthStore((state) => state.loadToken);
   const isReady = useAuthStore((state) => state.isReady);
 useEffect(() => {
     // ✅ load token + user when tabs layout mounts
     loadToken();
   }, []); 
   // Only render tabs after token is loaded
   if (!isReady) {
     return null// or a loading spinner
   }

  
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
              name="AreaMap"
              options={{
                title: "Map",
                headerTitle: "Nearby Issues",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="compass" size={size} color={color} />
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