import "mapbox-gl/dist/mapbox-gl.css";

import { Pressable, Text, View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'

const Home = () => {
  const router = useRouter();
  
  const LoginCard = ({ title, description, icon, onPress, bgColor }) => (
    <Pressable 
      onPress={onPress}
      activeOpacity={0.8}
      className="w-full mb-4"
    >
      <View 
        className="rounded-2xl p-6 shadow-lg"
        style={{
          backgroundColor: bgColor,
          shadowColor: "#FFA500",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center mb-2">
          <Text className="text-3xl mr-3">{icon}</Text>
          <Text className="text-white text-xl font-bold flex-1">{title}</Text>
        </View>
        <Text className="text-white text-sm opacity-90">{description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF7ED' }}>
      <ScrollView 
        className="flex-1 px-6 pt-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="items-center mb-12">
          <View className="bg-orange-500 rounded-full p-4 mb-6">
            <Text className="text-4xl">🏛️</Text>
          </View>
          <Text className="text-4xl font-bold text-orange-600 text-center mb-2">
            CivicFix
          </Text>
          <Text className="text-lg text-gray-600 text-center leading-6">
            Your Digital Bridge to Better City Services
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            Report issues, track progress, make a difference
          </Text>
        </View>

        {/* Login Options */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choose Your Role
          </Text>
          
          <LoginCard
            title="Citizen Portal"
            description="Report issues, track complaints, and stay updated on city services"
            icon="👤"
            bgColor="#EA580C"
            onPress={() => router.push('/citizenLogin')}
          />
          
          <LoginCard
            title="Department Access"
            description="Manage assignments, update status, and resolve citizen complaints"
            icon="🏢"
            bgColor="#DC2626"
            onPress={() => router.push('/deptLogin')}
          />
          
          <LoginCard
            title="Authority Dashboard"
            description="Oversee operations, monitor performance, and ensure accountability"
            icon="⚖️"
            bgColor="#7C2D12"
            onPress={() => router.push('/AutorityLogin')}
          />
        </View>

        {/* Admin Access - Smaller, Less Prominent */}
       

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-xs text-center">
            Making cities better, one report at a time
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Version 1.0 • CivicFix Platform
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default Home

