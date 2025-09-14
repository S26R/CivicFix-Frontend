import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAuthStore } from "../store/useAuthStore.js";
import { API_URL, MAPBOX_API_KEY } from "@env";
import StatusBadge from "../Components/StatusBadge.jsx";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const Allissues_dash = ({  button = true }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  const [votingIssueId, setVotingIssueId] = useState(null); // track which issue is being voted
const router=useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getLocation();
  }, []);

  useEffect(() => {
  const fetchCitizenFeed = async () => {
    if (!location || !token || !user) return;

    try {
      setLoading(true);
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      const REVERSE_GEOCODING_API_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_API_KEY}`;
      const geoResponse = await fetch(REVERSE_GEOCODING_API_URL);
      const geoData = await geoResponse.json();

      let context = "rural";
      const isUrban = geoData.features.some((feature) =>
        feature.place_type.includes("place") || feature.place_type.includes("locality")
      );
      if (isUrban) context = "urban";

      const url = `${API_URL}/api/issues/feed/citizen?lat=${lat}&lng=${lng}&context=${context}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch citizen feed");

      const data = await res.json();

      // 🔹 Always recalc hasUpvoted from server’s upvotes array
      const issuesWithVoteStatus = data.issues.map((issue) => ({
        ...issue,
        hasUpvoted: issue.upvotes.includes(user.id),
      }));

      setIssues(issuesWithVoteStatus);
    } catch (err) {
      console.error("Error fetching citizen feed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCitizenFeed();
}, [location, token, user]);


  const handleVote = async (issueId) => {
    setVotingIssueId(issueId);

    const issueToVote = issues.find((i) => i._id === issueId);
    if (!issueToVote) {
      setVotingIssueId(null);
      return;
    }

    const method = issueToVote.hasUpvoted ? "DELETE" : "POST";
    const url = `${API_URL}/api/issues/${issueId}/upvote`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setIssues((prevIssues) =>
          prevIssues.map((issue) => {
            if (issue._id === issueId) {
              return {
                ...issue,
                upvotes: data.count, // backend should return the updated count
                hasUpvoted: !issue.hasUpvoted,
              };
            }
            return issue;
          })
        );

        const toastMessage = issueToVote.hasUpvoted ? "Upvote Removed!" : "Upvoted!";
        Toast.show({ type: "success", text1: toastMessage, text2: data.msg });
      } else {
        Toast.show({
          type: "error",
          text1: "Voting Failed",
          text2: data.msg || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error upvoting issue:", err);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Could not connect to the server.",
      });
    } finally {
      setVotingIssueId(null);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-500">
          {location ? "Fetching relevant issues..." : "Getting your location..."}
        </Text>
      </View>
    );
  }

  if (locationErrorMsg) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{locationErrorMsg}</Text>
        <Text className="text-gray-500 text-center mt-2">
          Please enable location services in your device settings to see nearby issues.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex-1 p-4 m-2 bg-white rounded-2xl shadow-lg border border-orange-200"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Text className="text-2xl font-bold text-orange-600 mb-6">Nearby Issues</Text>
        <Text className="text-gray-600 mb-4 text-xl">
          AI-Powered Feed. This feed uses a smart algorithm to show you the issues that matter most, based on your location and real-time community upvotes.
        </Text>
        {issues.length === 0 ? (
          <Text className="text-gray-500 text-center mt-4">No nearby issues found.</Text>
        ) : (
          issues.map((issue) => {
            const createdAt = new Date(issue.createdAt);
            const formattedDate = createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <TouchableOpacity
                key={issue._id}
                onPress={() => router.push(`/ReportsDetails?id=${issue._id}`)}
              >
              
                <View
                  className="mb-3 rounded-2xl bg-orange-50 p-3 border border-orange-200"
                  style={{
                    shadowColor: "#f97316",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: 6,
                  }}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-3">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">{issue.topic}</Text>
                      <Text className="text-gray-600 mb-2">{issue.description}</Text>
                      <Text className="text-sm text-gray-500 mb-2">{issue.department}</Text>
                      <View>
                        <StatusBadge status={issue.status} />
                      </View>
                    </View>
                    <View className="items-end">
                      {issue.media && issue.media.length > 0 && (
                        <Image
                          source={{ uri: issue.media[0].url }}
                          className="w-32 h-20 rounded-xl mb-2 border border-orange-200"
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="arrow-up-circle" size={20} color="#f97316" />
                      <Text className="ml-2 text-gray-800 font-medium">
                        {Array.isArray(issue.upvotes) ? issue.upvotes.length : issue.upvotes} Upvotes
                      </Text>
                      {button && (
                        <TouchableOpacity
                          onPress={() => handleVote(issue._id)}
                          activeOpacity={0.7}
                          className={`px-4 py-2 ml-4 rounded-lg shadow-md ${
                            issue.hasUpvoted ? "bg-gray-500" : "bg-orange-500"
                          }`}
                          disabled={votingIssueId === issue._id}
                        >
                          <Text className="text-white font-semibold">
                            {votingIssueId === issue._id
                              ? "..."
                              : issue.hasUpvoted
                              ? "Remove Upvote"
                              : "Upvote"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500">{formattedDate}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

export default Allissues_dash;
