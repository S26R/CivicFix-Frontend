import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import { useAuthStore } from "../../store/useAuthStore.js";
import { API_URL } from "@env";
import { PieChart } from "react-native-chart-kit";

import { BarChart } from "react-native-chart-kit";

import HotspotsMap from "../../Components/HotspotMap.jsx";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsDemo() {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect(() => {
    if (!token) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/authority/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No data available</Text>
      </View>
    );
  }

  // Extract status data for BarChart
  const statusKeys = Object.keys(data.byStatus || {});
  const statusValues = statusKeys.map((key) => data.byStatus[key]);

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#f97316" }}>
        Analytics Demo
      </Text>

      {/* Total Issues */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: "#e6f7ff", marginBottom: 16 }}>
        <Text style={{ color: "#6b7280", fontSize: 14 }}>Total Issues</Text>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#f97316" }}>{data.total}</Text>
      </View>

      {/* Status Bar Chart */}
      {statusValues.length > 0 ? (
        <BarChart
          data={{
            labels: statusKeys,
            datasets: [{ data: statusValues }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(249,115,22, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(51,51,51, ${opacity})`,
          }}
          style={{ borderRadius: 12 }}
        />
      ) : (
        <Text>No status data</Text>
      )}
      {/* Severity Pie Chart */}
<View style={{ marginTop: 24 }}>
  <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#333" }}>
    Issues by Severity
  </Text>

  {data.bySeverity && Object.keys(data.bySeverity).length > 0 ? (
    <PieChart
      data={Object.keys(data.bySeverity).map((key, i) => ({
        name: key,
        population: data.bySeverity[key],
        color: ["#22c55e", "#facc15", "#ef4444"][i], // green, yellow, red
        legendFontColor: "#333",
        legendFontSize: 12,
      }))}
      width={screenWidth - 32}
      height={220}
      chartConfig={{
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  ) : (
    <Text>No severity data</Text>
  )}
</View>
<Text style={{ marginTop: 12, marginBottom: 6, fontWeight: "600" }}>Top Reporters</Text>
{data.topReporters && data.topReporters.length ? (
  <BarChart
    data={{
      labels: data.topReporters.map(r => r.name || r.userId),
      datasets: [{ data: data.topReporters.map(r => r.count) }],
    }}
    width={screenWidth - 24}
    height={220}
    fromZero
    showValuesOnTopOfBars
    chartConfig={{
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(249,115,22, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(51,51,51, ${opacity})`,
    }}
    style={{
      marginVertical: 8,
      borderRadius: 12,
    }}
  />
) : (
  <Text style={{ color: "#666" }}>No reporters</Text>
)}
{/* Hotspots */}
<Text style={{ marginTop: 12, marginBottom: 6, fontWeight: "600" }}>
  Top hotspots
</Text>

{data.hotspots && data.hotspots.length ? (
  <HotspotsMap hotspots={data.hotspots} />
) : (
  <Text style={{ color: "#666" }}>No hotspots</Text>
)}



    </ScrollView>
  );  
}     
