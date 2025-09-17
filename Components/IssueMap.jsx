// import React, { useEffect, useRef } from "react";
// import { View, Platform, Animated, Easing } from "react-native";
// import MapboxGL from "@rnmapbox/maps";
// import Map, { Marker as WebMarker } from "react-map-gl/mapbox";
// import { MAPBOX_API_KEY } from "@env";

// // Mobile Mapbox token
// if (Platform.OS !== "web") {
//   MapboxGL = require("@rnmapbox/maps").default;
//   MapboxGL.setAccessToken(MAPBOX_API_KEY);
// }

// const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// // Modern bouncing map pin
// const MapPin = ({ color = "#f97316", size = 28 }) => {
//   const bounceAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: -10,
//           duration: 500,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   if (Platform.OS !== "web") {
//     return (
//       <Animated.View style={{ transform: [{ translateY: bounceAnim }], alignItems: "center" }}>
//         <View
//           style={{
//             width: size / 2,
//             height: size / 2,
//             backgroundColor: color,
//             borderRadius: size / 4,
//             borderWidth: 1,
//             borderColor: "white",
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.3,
//             shadowRadius: 3,
//             zIndex: 2,
//           }}
//         />
//         <View
//           style={{
//             width: 0,
//             height: 0,
//             borderLeftWidth: size / 4,
//             borderRightWidth: size / 4,
//             borderTopWidth: size / 2,
//             borderLeftColor: "transparent",
//             borderRightColor: "transparent",
//             borderTopColor: color,
//             marginTop: -1,
//           }}
//         />
//       </Animated.View>
//     );
//   }

//   // Web version
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "bounce 1s infinite alternate" }}>
//       <div
//         style={{
//           width: size / 2,
//           height: size / 2,
//           backgroundColor: color,
//           borderRadius: "50%",
//           border: "2px solid white",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
//           zIndex: 2,
//         }}
//       />
//       <div
//         style={{
//           width: 0,
//           height: 0,
//           borderLeft: `${size / 4}px solid transparent`,
//           borderRight: `${size / 4}px solid transparent`,
//           borderTop: `${size / 2}px solid ${color}`,
//           marginTop: -1,
//         }}
//       />
//       <style>
//         {`
//           @keyframes bounce {
//             0% { transform: translateY(0); }
//             100% { transform: translateY(-10px); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// const IssueMap = ({ latitude, longitude, zoom = 14 }) => {
//   // Robust check for backend coordinates



//   console.log("Iam From Issuemap getting cood",latitude,longitude)
 

//   // WEB
//   if (Platform.OS === "web") {
//     return (
//       <div
//         style={{
//           width: "100%",
//           height: "200px",
//           borderRadius: 12,
//           overflow: "hidden",
//           border: "1px solid #f97316",
//           margin: "1px 0",
//         }}
//       >
//         <Map
//           initialViewState={{
//             longitude: longitude,
//             latitude: latitude,
//             zoom,
//           }}
//           style={{ width: "100%", height: "100%" }}
//           mapboxAccessToken={MAPBOX_API_KEY}
//           mapStyle="mapbox://styles/mapbox/streets-v11"
//         >
//           <WebMarker longitude={longitude} latitude={latitude}>
//             <MapPin color="#f97316" size={28} />
//           </WebMarker>
//         </Map>
//       </div>
//     );
//   }

//   // MOBILE
//   return (
//     <View
//       style={{
//         height: 200,
//         marginVertical: 12,
//         borderRadius: 12,
//         overflow: "hidden",
//         borderWidth: 1,
//         borderColor: "#f97316",
//         alignItems: "center",
//       }}
//     >
//       <MapboxGL.MapView style={{ flex: 1 }}>
//         <MapboxGL.Camera zoomLevel={zoom} centerCoordinate={[center.longitude, center.latitude]} />
//         <MapboxGL.PointAnnotation id="issueMarker" coordinate={[center.longitude, center.latitude]}>
//           <MapPin color="#f97316" size={28} />
//         </MapboxGL.PointAnnotation>
//       </MapboxGL.MapView>
//     </View>
//   );
// };

// export default IssueMap;
import { View, Text } from 'react-native'
import React from 'react'

export default function IssueMap() {
  return (
    <View>
      <Text>IssueMap</Text>
    </View>
  )
}