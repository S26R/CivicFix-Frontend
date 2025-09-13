import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import MyReports_dash from '../../Components/MyReports_dash'

const MyReports = () => {
  const n=8
  return (
     <ScrollView
            className="bg-white flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <MyReports_dash n={8} link={true}/>
            
          </ScrollView>
  )
}

export default MyReports