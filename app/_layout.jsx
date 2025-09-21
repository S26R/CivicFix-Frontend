// import { Stack } from "expo-router";
// import "../global.css";
// import Toast from "react-native-toast-message";
// import { useAuthStore } from "../store/useAuthStore";
// import { ActivityIndicator, View } from "react-native";
// import { useEffect } from "react";

// export default function RootLayout() {
//    const { init, isReady } = useAuthStore();

//   useEffect(() => {
//     init(); // load token once
//   }, []);

//   if (!isReady) {
//     // while token loads, show loader
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//   return (
//     <>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: "#f4511e",
//           },
//           headerTintColor: "#fff",
//           headerTitleStyle: {
//             fontWeight: "bold",
//           },
//         }}
//       >
//         <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
//         <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
//         <Stack.Screen name="citizenLogin" options={{ title: "Login" }} />
//         <Stack.Screen name="deptLogin" options={{ title: "Login" }} />
//         <Stack.Screen name="AutorityLogin" options={{ title: "Login" }} />
//         <Stack.Screen name="(DashBoard)" options={{ headerShown: false }} />
//         <Stack.Screen name="(Reports)" options={{ headerShown: false }} />
//         <Stack.Screen name="(Admin)" options={{ headerShown: false }} />
//         <Stack.Screen name="(Department)" options={{ headerShown: false }} />
//         <Stack.Screen name="(Admin_dash)" options={{ headerShown: false }} />
//       </Stack>

//       {/* 👇 Toast MUST be outside the Stack */}
//       <Toast />
//     </>
//   );
// }
import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/useAuthStore";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context"; // <--- add this

export default function RootLayout() {
  const { init, isReady } = useAuthStore();

  useEffect(() => {
    init(); // load token once
  }, []);

  if (!isReady) {
    // while token loads, show loader
    return (
      <SafeAreaProvider> {/* wrap with SafeAreaProvider */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider> {/* wrap the whole app */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
        <Stack.Screen name="citizenLogin" options={{ title: "Login" }} />
        <Stack.Screen name="deptLogin" options={{ title: "Login" }} />
        <Stack.Screen name="AutorityLogin" options={{ title: "Login" }} />
        <Stack.Screen name="(DashBoard)" options={{ headerShown: false }} />
        <Stack.Screen name="(Reports)" options={{ headerShown: false }} />
        <Stack.Screen name="(Admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(Department)" options={{ headerShown: false }} />
        <Stack.Screen name="(Admin_dash)" options={{ headerShown: false }} />
      </Stack>

      {/* 👇 Toast MUST be outside the Stack */}
      <Toast />
    </SafeAreaProvider>
  );
}
