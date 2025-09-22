import React, { useRef, useEffect } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// Animated bouncing pin
const DancingPin = ({ color = "#f97316", size = 24 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: size / 2,
            height: size / 2,
            backgroundColor: color,
            borderRadius: size / 4,
            borderWidth: 1,
            borderColor: "white",
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
      </View>
    </Animated.View>
  );
};

export default function HotspotsMap({ hotspots = [] }) {
  const center = hotspots.length
    ? { latitude: hotspots[0].lat, longitude: hotspots[0].lng }
    : defaultCenter;

  const getColor = (count) =>
    count > 4 ? "red" : count > 2 ? "orange" : "green";

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {hotspots.map((h, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: h.lat, longitude: h.lng }}
          >
            <DancingPin color={getColor(h.count)} size={28} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
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
