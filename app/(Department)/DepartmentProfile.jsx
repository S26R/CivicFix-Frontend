import { View, Text, TouchableOpacity, Alert } from 'react-native'

import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import Toast from 'react-native-toast-message';

export default function Profile() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    Toast.show({type:"success",text1:"Logged OUT successfully"})
    router.replace("/");
  };
  return (
    <View>
     
             <TouchableOpacity
               onPress={handleLogout}
               className="bg-red-500 rounded-xl py-3 mt-4"
               activeOpacity={0.7}
             >
               <Text className="text-white text-center text-lg font-semibold">
                 Logout
               </Text>
             </TouchableOpacity>
    </View>
  )
}