import React from "react";
import { View } from "react-native";
import Map, { Marker } from "react-map-gl/mapbox";
import { MAPBOX_API_KEY } from "@env";
import MapboxGL from "@rnmapbox/maps"; 
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  MapboxGL = require("@rnmapbox/maps").default;
  MapboxGL.setAccessToken(MAPBOX_API_KEY);
}

export default function HotspotsMap({ hotspots }) {
  const defaultCenter = { latitude: 13.02, longitude: 78.61 };
  const center = hotspots.length
    ? { latitude: hotspots[0].lat, longitude: hotspots[0].lng }
    : defaultCenter;

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
            <Marker
              key={idx}
              longitude={h.lng}
              latitude={h.lat}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: getColor(h.count),
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </Marker>
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
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: getColor(h.count),
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        )
      )}
    </View>
  );
}
