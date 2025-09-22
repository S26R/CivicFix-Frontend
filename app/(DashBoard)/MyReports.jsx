import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useRef } from 'react'
import MyReports_dash from '../../Components/MyReports_dash.jsx'
import { useRouter } from 'expo-router'

const MyReports = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const childRef = useRef(null);

  // Handle refresh - this will trigger the child component to refresh its data
  const onRefresh = () => {
    setRefreshing(true);
    // The child component will handle the actual data fetching
    // We'll pass this down via props
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Fallback timeout in case child doesn't update
  };

  return (
     <ScrollView
            className="bg-white flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#f97316"]} // Android
                tintColor="#f97316" // iOS
              />
            }
          >
            <MyReports_dash 
              router={router} 
              n={100} 
              link={true}
              refreshing={refreshing}
              setRefreshing={setRefreshing}
            />
            
          </ScrollView>
  )
}

export default MyReports