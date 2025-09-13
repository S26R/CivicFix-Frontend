import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import MyReports_dash from '../../Components/MyReports_dash.jsx'
import { useRouter } from 'expo-router'

const MyReports = () => {
  const router = useRouter();
  const n=8
  return (
     <ScrollView
            className="bg-white flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <MyReports_dash router={router} n={8} link={true}/>
            
          </ScrollView>
  )
}

export default MyReports