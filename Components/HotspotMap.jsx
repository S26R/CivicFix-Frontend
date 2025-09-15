import React, { useRef, useEffect } from "react";
import { View, Animated, Easing, Platform } from "react-native";
import Map, { Marker as WebMarker } from "react-map-gl/mapbox";
import MapboxGL from "@rnmapbox/maps";
import { MAPBOX_API_KEY } from "@env";

if (Platform.OS !== "web") {
  MapboxGL = require("@rnmapbox/maps").default;
  MapboxGL.setAccessToken(MAPBOX_API_KEY);
}

const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// 🎯 Animated dancing pin
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
        {/* Circle */}
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
        {/* Triangle */}
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

export default function HotspotsMap({ hotspots }) {
  const center = hotspots.length
    ? { latitude: hotspots[0].lat, longitude: hotspots[0].lng }
    : defaultCenter;

  // 🔥 Dynamic pin color
  const getColor = (count) =>
    count > 4 ? "red" : count > 2 ? "orange" : "green";

  return (
    <View style={{ height: 400, width: "100%", marginVertical: 12 }}>
      {Platform.OS === "web" ? (
        <Map
          initialViewState={{
            longitude: center.longitude,
            latitude: center.latitude,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken={MAPBOX_API_KEY}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {hotspots.map((h, idx) => (
            <WebMarker key={idx} longitude={h.lng} latitude={h.lat}>
              <DancingPin color={getColor(h.count)} size={28} />
            </WebMarker>
          ))}
        </Map>
      ) : (
        MapboxGL && (
          <MapboxGL.MapView style={{ flex: 1 }}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[center.longitude, center.latitude]}
            />
            {hotspots.map((h, i) => (
              <MapboxGL.PointAnnotation
                key={i}
                id={`hotspot-${i}`}
                coordinate={[h.lng, h.lat]}
              >
                <DancingPin color={getColor(h.count)} size={28} />
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        )
      )}
    </View>
  );
}
