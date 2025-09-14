import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Allissues_dash from '../../Components/Allissues_dash'


const home_admin = () => {
  return (
    <View className="flex-1 bg-white p-4" contentContainerStyle={{ paddingBottom: 20 }}>
  <Text className="text-3xl font-bold text-orange-600 mb-4">Reports Management</Text>
  {/* Summary Cards */}
    <View className="flex-row justify-between mb-6 mt-3">
    <View className="flex-1 mx-1 bg-blue-100 rounded-2xl border border-blue-200 p-4 shadow-md max-w-xs">
      <Text className="text-gray-500 text-sm">Total Issues</Text>
      <Text className="text-2xl font-bold text-blue-700">15</Text>
    </View>
    <View className="flex-1 mx-1 bg-green-100 rounded-2xl border border-green-200 p-4 shadow-md">
      <Text className="text-gray-500 text-sm">Avg Response</Text>
      <Text className="text-2xl font-bold text-green-600">7 hrs</Text>
    </View>
    <View className="flex-1 mx-1 bg-orange-100 rounded-2xl border border-orange-200 p-4 shadow-md">
      <Text className="text-gray-500 text-sm">In Progress</Text>
      <Text className="text-2xl font-bold text-orange-600">9</Text>
    </View>
  </View>
  <ScrollView
    className="bg-white flex-1"
    contentContainerStyle={{ paddingBottom: 20 }}
    showsVerticalScrollIndicator={false}
  >
    {/* Allissues_dash */}
  {/* <Allissues_dash button={false}/> */}


 <Text>Note:Will have a separate issue panel for authority</Text> 
  </ScrollView>
</View>
  )
}

export default home_admin