import { View, Text,Image} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';



const MyReports_dash = ({n=3,link=false}) => {
    const router = useRouter();
    const [QueryData, setQueryData] = useState(
        {
            "issues": [
                {
                    "_id": "68bbb7be758de3782106958b",
                    "topic": "Burst water pipeline",
                    "description": "Water flooding near central road",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.3645,
                            22.5731
                        ]
                    },
                    "upvotes": 12,
                    "severity": "critical",
                    "status": "in-progress",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.288Z",
                    "updatedAt": "2025-09-06T04:25:34.288Z",
                    "distance": 83.07661677735028,
                    "proximityFactor": 0.98338467664453,
                    "upvoteFactor": 0.12,
                    "recencyFactor": 0.9999182012623659,
                    "severityFactor": 1,
                    "score": 0.6429990432458321
                },
                {
                    "_id": "68bbb7be758de3782106958c",
                    "topic": "Major traffic light failure",
                    "description": "Signal not working at busy junction",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.39,
                            22.57
                        ]
                    },
                    "upvotes": 50,
                    "severity": "critical",
                    "status": "pending",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.292Z",
                    "updatedAt": "2025-09-06T04:25:34.292Z",
                    "distance": 2698.440755333826,
                    "proximityFactor": 0.46031184893323485,
                    "upvoteFactor": 0.5,
                    "recencyFactor": 0.9999182151501187,
                    "severityFactor": 1,
                    "score": 0.6380771977099943
                },
                {
                    "_id": "68bbb7be758de3782106958d",
                    "topic": "Garbage overflow near market",
                    "description": "Bin overflowing, bad smell",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.37,
                            22.575
                        ]
                    },
                    "upvotes": 20,
                    "severity": "moderate",
                    "status": "in-progress",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.292Z",
                    "updatedAt": "2025-09-06T04:25:34.292Z",
                    "distance": 681.5658217670716,
                    "proximityFactor": 0.8636868356465857,
                    "upvoteFactor": 0.2,
                    "recencyFactor": 0.9999182151501187,
                    "severityFactor": 0.6,
                    "score": 0.5990896937239996
                },
                {
                    "_id": "68bbb7be758de3782106958f",
                    "topic": "Pothole in residential lane",
                    "description": "Causing two-wheeler accidents",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.365,
                            22.572
                        ]
                    },
                    "upvotes": 5,
                    "severity": "minor",
                    "status": "pending",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.292Z",
                    "updatedAt": "2025-09-06T04:25:34.292Z",
                    "distance": 131.32409146884316,
                    "proximityFactor": 0.9737351817062314,
                    "upvoteFactor": 0.05,
                    "recencyFactor": 0.9999182151501187,
                    "severityFactor": 0.3,
                    "score": 0.5421041975418932
                },
                {
                    "_id": "68bbb7be758de3782106958e",
                    "topic": "School boundary wall broken",
                    "description": "Unsafe for children",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.38,
                            22.571
                        ]
                    },
                    "upvotes": 8,
                    "severity": "moderate",
                    "status": "pending",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.292Z",
                    "updatedAt": "2025-09-06T04:25:34.292Z",
                    "distance": 1664.5037486532274,
                    "proximityFactor": 0.6670992502693545,
                    "upvoteFactor": 0.08,
                    "recencyFactor": 0.9999182151501187,
                    "severityFactor": 0.6,
                    "score": 0.4921134181108301
                },
                {
                    "_id": "68bbb7be758de37821069590",
                    "topic": "Broken public bench in park",
                    "description": "Metal frame sticking out",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            88.4,
                            22.58
                        ]
                    },
                    "upvotes": 15,
                    "severity": "minor",
                    "status": "in-progress",
                    "__v": 0,
                    "createdAt": "2025-09-06T04:25:34.293Z",
                    "updatedAt": "2025-09-06T04:25:34.293Z",
                    "distance": 3800.9974300254153,
                    "proximityFactor": 0.23980051399491698,
                    "upvoteFactor": 0.15,
                    "recencyFactor": 0.999918218622057,
                    "severityFactor": 0.3,
                    "score": 0.36192379792288654
                }
            ]
        }
    );
    
  return (
    <View className=" rounded-2xl bg-orange-50 shadow-lg border border-orange-200 m-2">
    <View className=" bg-white p-4 rounded-lg">
    <Text className="text-2xl font-bold text-orange-600 mb-6">
      My Reports
    </Text>

    {QueryData.issues.slice(0, n).map((issue) => (
      <TouchableOpacity
        key={issue._id}
        onPress={() => {router.push({pathname:"/ReportsDetails",params:{id:issue._id}})}}
        disabled={!link}
        >

        <View
        key={issue._id}
        className="mb-3 rounded-2xl min-h-5 bg-orange-50 p-3 border border-orange-200"
        style={{
          shadowColor: "#f97316",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 6,
        }}
        >
        {/* Image */}
        {/* <Image
          source={{ uri: issue.image }}
          className="w-full h-40 rounded-xl mb-3"
          resizeMode="cover"
          /> */}

        {/* Title */}
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {issue.topic}
        </Text>

        {/* Description */}
        <Text className="text-gray-600 mb-3">{issue.description}</Text>

        {/* Upvotes */}
        <View className="flex-row items-center">
          <Ionicons name="arrow-up-circle" size={20} color="#f97316" />
          <Text className="ml-2 text-gray-800 font-medium">
            {issue.upvotes} Upvotes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    ))}
  </View>
  </View>
);
}

export default MyReports_dash