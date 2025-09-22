import React, { useRef, useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAuthStore } from "../store/useAuthStore.js";
import Constants from "expo-constants";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;
const API_URL = Constants.expoConfig?.extra?.API_URL;

// Default coordinates if none provided
const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// Animated bouncing pin
const MapPin = ({ color = "#f97316", size = 20 }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
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

// Helper function to get marker color based on status
const getMarkerColor = (status) => {
  switch (status?.toLowerCase()) {
    case "resolved":
      return "#10b981"; // green
    case "in-progress":
      return "#f59e0b"; // yellow
    case "rejected":
      return "#ef4444"; // red
    default:
      return "#f97316"; // orange (pending)
  }
};

// Main Nearby Issues Map Component
const NearbyIssuesMap = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  
  // Safe access to auth store with error handling
  let token = null;
  let user = null;
  let isReady = false;
  
  try {
    const authStore = useAuthStore();
    token = authStore.token;
    user = authStore.user;
    isReady = authStore.isReady;
  } catch (error) {
    console.log("Auth store not available yet:", error);
  }

  // Don't render anything if auth store isn't ready
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🔄 Initializing...</Text>
      </View>
    );
  }

  // Don't render if user isn't logged in
  if (!token || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>📍 Please log in to see nearby issues</Text>
      </View>
    );
  }

  // Get user location
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationErrorMsg("Permission to access location was denied");
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.log("Location error:", error);
        setLocationErrorMsg("Unable to get location");
      }
    };
    
    // Only try to get location if we have proper context
    if (token && user) {
      getLocation();
    }
  }, [token, user]);

  // Fetch nearby issues
  useEffect(() => {
    const fetchNearbyIssues = async () => {
      if (!location || !token || !user) return;

      try {
        setLoading(true);
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        // Simplified approach - try to get issues without complex geocoding first
        const url = `${API_URL}/api/issues/feed/citizen?lat=${lat}&lng=${lng}&context=urban`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.log("API response not ok:", res.status);
          setIssues([]);
          return;
        }

        const data = await res.json();
        setIssues(data.issues || []);
      } catch (err) {
        console.error("Error fetching nearby issues:", err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have all required data
    if (location && token && user) {
      fetchNearbyIssues();
    }
  }, [location, token, user]);

  // Calculate map center and region
  const getMapRegion = () => {
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return {
      ...defaultCenter,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

  if (locationErrorMsg) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>📍 {locationErrorMsg}</Text>
          <Text style={styles.errorSubtext}>Enable location to see nearby issues</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🗺️ Loading nearby issues...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === "android" ? "google" : undefined}
          initialRegion={getMapRegion()}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Render markers for each nearby issue */}
          {issues.map((issue) => {
            if (!issue.location?.coordinates || issue.location.coordinates.length !== 2) {
              return null;
            }

            const [lng, lat] = issue.location.coordinates;
            const markerColor = getMarkerColor(issue.status);

            return (
              <Marker
                key={issue._id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={issue.topic}
                description={`${issue.status?.toUpperCase()} - ${issue.department}`}
              >
                <MapPin color={markerColor} size={24} />
              </Marker>
            );
          })}
        </MapView>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#f97316" }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
          <Text style={styles.legendText}>Resolved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
          <Text style={styles.legendText}>Rejected</Text>
        </View>
      </View>

      {/* Info */}
      <Text style={styles.infoText}>
        {issues.length > 0 ? `Showing ${issues.length} nearby issues` : "No nearby issues found"}
      </Text>
    </View>
  );
};

export default NearbyIssuesMap;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#f97316",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  map: {
    flex: 1,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 8,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: "#7f1d1d",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef7ed",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  loadingText: {
    fontSize: 14,
    color: "#ea580c",
    fontWeight: "600",
  },
});
