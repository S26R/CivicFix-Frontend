import React, { useRef, useEffect } from "react";
import { View, Animated, Easing, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Default coordinates if none provided
const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// Animated bouncing pin
const MapPin = ({ color = "#f97316", size = 28 }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{ transform: [{ translateY: bounceAnim }], alignItems: "center" }}
    >
      <View
        style={{
          width: size / 2,
          height: size / 2,
          backgroundColor: color,
          borderRadius: size / 4,
          borderWidth: 1,
          borderColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          zIndex: 2,
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size / 4,
          borderRightWidth: size / 4,
          borderTopWidth: size / 2,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
          marginTop: -1,
        }}
      />
    </Animated.View>
  );
};

// Main Map Component
const IssueMap = ({ latitude, longitude }) => {
  const center =
    latitude && longitude
      ? { latitude, longitude }
      : defaultCenter; // fallback

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={Platform.OS === "android" ? "google" : undefined}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={center}>
          <MapPin color="#f97316" size={28} />
        </Marker>
      </MapView>
    </View>
  );
};

export default IssueMap;

const styles = StyleSheet.create({
  mapContainer: {
    height: 400, // match HotspotsMap for visibility
    width: "100%",
    marginVertical: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  map: {
    flex: 1,
  },
});
