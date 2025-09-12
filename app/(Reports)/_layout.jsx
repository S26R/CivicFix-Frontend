import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ReportLayouts = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="ReportsDetails" options={{title: "Report Details"}}/>
        <Stack.Screen name="AddPost" options={{title: "Add Report"}}/>
    </Stack>
  )
}

export default ReportLayouts