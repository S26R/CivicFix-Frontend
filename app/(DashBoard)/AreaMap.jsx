import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import NearbyIssuesMap from '../../Components/NearbyIssuesMap.jsx'

const AreaMap = () => {
  return (
    <View className="flex-1 bg-white">
      <View>
       
        
        
        {/* Nearby Issues Map Section */}
        <View className=" bg-orange-50 shadow-lg border border-orange-200">
          <View className="bg-white">
            
            <NearbyIssuesMap />
            
          </View>
        </View>

        {/* Additional Information */}
        {/* <View className="rounded-2xl bg-white shadow-lg border border-gray-200 p-4"> */}
          {/* <Text className="text-lg font-semibold text-gray-800 mb-2">
            📋 How to Use
          </Text>
          <Text className="text-gray-600 mb-2">
            • 🟠 Orange markers: Pending issues
          </Text>
          <Text className="text-gray-600 mb-2">
            • 🟡 Yellow markers: Issues in progress
          </Text>
          <Text className="text-gray-600 mb-2">
            • 🟢 Green markers: Resolved issues
          </Text>
          <Text className="text-gray-600 mb-2">
            • 🔴 Red markers: Rejected issues
          </Text> */}
          {/* <Text className="text-gray-600 mt-3">
            💡 Enable location services to see issues near you. Tap any marker to view detailed information about the civic issue.
          </Text> */}
        {/* </View> */}
      </View>
    </View>
  )
}

export default AreaMap