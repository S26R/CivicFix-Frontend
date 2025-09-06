import {  Pressable, Text, View } from 'react-native'
import {useRouter} from 'expo-router'
import React from 'react'

const Home = () => {
  const router = useRouter();
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Home</Text>
      <Pressable style={{marginTop:20, padding:10, backgroundColor:'rgba(62, 110, 177, 0.5)'}}onPress={()=>router.push('/citizenLogin')}>
        <Text style={{color:'#fff'}}>Login as citizen</Text>
      </Pressable>
      <Pressable style={{marginTop:20, padding:10, backgroundColor:'rgba(62, 110, 177, 0.5)'}}onPress={()=>router.push('/deptLogin')}>
        <Text style={{color:'#fff'}}>Login as department</Text>
      </Pressable>
      <Pressable style={{marginTop:20, padding:10, backgroundColor:'rgba(62, 110, 177, 0.5)'}}onPress={()=>router.push('/AutorityLogin')}>
        <Text style={{color:'#fff'}}>Login as Autority</Text>
      </Pressable>
      <Pressable style={{marginTop:20, padding:10, backgroundColor:'rgba(62, 110, 177, 0.5)'}}onPress={()=>router.push('/signup')}>
        <Text style={{color:'#fff'}}>Sign Up</Text>
      </Pressable>
      <Pressable style={{marginTop:20, padding:10, backgroundColor:'rgba(62, 110, 177, 0.5)'}}onPress={()=>router.push('/(DashBoard)/Home')}>
        <Text style={{color:'#fff'}}>Go to Dashboard</Text>
      </Pressable>
    </View>
  )
}

export default Home

