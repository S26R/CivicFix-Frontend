import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGL from "@rnmapbox/maps";


import { useAuthStore } from "../store/useAuthStore.js";
import Constants from "expo-constants";

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const API_URL = process.env.API_URL;

// Default coordinates if none provided
const defaultCenter = { latitude: 13.02, longitude: 78.61 };

// Animated bouncing pin for web
const MapPin = ({ color = "#f97316", size = 20 }) => {
  const pinRef = useRef(null);

  useEffect(() => {
    if (pinRef.current) {
      // Create CSS animation for bouncing effect
      pinRef.current.style.animation = 'bounce 1.2s ease-in-out infinite';
    }
  }, []);

  return (
    <div 
      ref={pinRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          width: size / 2,
          height: size / 2,
          backgroundColor: color,
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 4}px solid transparent`,
          borderRight: `${size / 4}px solid transparent`,
          borderTop: `${size / 2}px solid ${color}`,
          marginTop: '-2px',
        }}
      />
    </div>
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

  // Get user location using browser geolocation API
  useEffect(() => {
    const getLocation = () => {
      if (token && user && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log("Location error:", error);
            setLocationErrorMsg("Permission to access location was denied");
          }
        );
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
        const lat = location.latitude;
        const lng = location.longitude;

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

  // Calculate map center
  const mapCenter = location || defaultCenter;

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
        <Map
          mapboxAccessToken={MAPBOX_API_KEY}
          initialViewState={{
            longitude: mapCenter.longitude,
            latitude: mapCenter.latitude,
            zoom: 12
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Add zoom and rotation controls */}
          <NavigationControl position="top-right" />

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
                longitude={lng} 
                latitude={lat} 
                anchor="bottom"
              >
                <div title={`${issue.topic} - ${issue.status?.toUpperCase()} - ${issue.department}`}>
                  <MapPin color={markerColor} size={24} />
                </div>
              </Marker>
            );
          })}
        </Map>
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
    </View>
  );
};

export default NearbyIssuesMap;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  mapContainer: {
    height: 590,
    width: "100%",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  errorContainer: {
    height: 300,
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
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef7ed",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  loadingText: {
    fontSize: 18,
    color: "#ea580c",
    fontWeight: "600",
  },
});

// Add CSS keyframes for the bouncing animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-8px);
      }
      60% {
        transform: translateY(-4px);
      }
    }
  `;
  document.head.appendChild(style);
}