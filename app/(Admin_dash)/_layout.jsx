
import React from 'react'
import { Stack } from 'expo-router'

const AdmindashLayout = () => {
  return (
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
        <Stack.Screen name="RaisedIssues" options={{ title: "Raised Issue"}} />
        <Stack.Screen name="InProgressIssues" options={{ title: "In Progress Issue"}} />
        <Stack.Screen name="AssignedIssues" options={{ title: "Assigned Issue"}} />
        <Stack.Screen name="ResolvedIssues" options={{ title: "Resolved Issue"}} />
        <Stack.Screen name="TotalIssues" options={{ title: "Total Issue"}} />
        <Stack.Screen name="RejectedIssues" options={{ title: "Rejected Issue"}} />
        <Stack.Screen name="Citizens" options={{ title: "Citizens"}} />
        <Stack.Screen name="Departments" options={{ title: "Departments"}} />
        <Stack.Screen name="Authorities" options={{ title: "Authorities"}} />
        </Stack>
  )
}

export default AdmindashLayout