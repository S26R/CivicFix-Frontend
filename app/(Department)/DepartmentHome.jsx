import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/useAuthStore';

export default function DepartmentHome() {
    const { user, token } = useAuthStore();
    React.useEffect(() => {
      if(user?.role !== "department" || !token) {
        // 🚫 Wrong role → kick to normal home
        router.replace("/");
      }
    }, [user, token]);
  return (
    <View>
      <Text>DepartmentHome</Text>
    </View>
  )
}