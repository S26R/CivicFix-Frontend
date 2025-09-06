import { View, Text } from 'react-native'
import React from 'react'
import MyReports_dash from '../../Components/MyReports_dash'
import Allissues_dash from '../../Components/Allissues_dash'
import { ScrollView } from 'react-native-web'

const Home = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className='bg-white flex-1'
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}>

        <MyReports_dash/>
        <Allissues_dash/>
      </ScrollView>
    </View>
  )
}

export default Home