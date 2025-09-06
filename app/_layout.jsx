import { Stack } from 'expo-router';
import "../global.css"




export default function RootLayout() {
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
      <Stack.Screen name="index" options={{title: "Home", headerShown:false}}/>
      <Stack.Screen name="signup" options={{title: "Sign Up"}}/>
      <Stack.Screen name="citizenLogin" options={{title: "Login"}}/>
      <Stack.Screen name="deptLogin" options={{title: "Login"}}/>
      <Stack.Screen name="AutorityLogin" options={{title: "Login"}}/>
      <Stack.Screen name="(DashBoard)" options={{headerShown:false}}/>
    </Stack>
  );
}
