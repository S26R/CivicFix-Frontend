import { View, Text, Image, ScrollView } from "react-native";
import { useSearchParams } from "expo-router";

const ParticipantsPage = ({ participants }) => {
  const params = useSearchParams();

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Participants Joined</Text>
      {participants.map((p) => (
        <View
          key={p.id}
          className="flex-row items-center mb-4 p-2 border rounded-xl shadow"
        >
          <Image
            source={{ uri: p.avatar }}
            className="w-12 h-12 rounded-full mr-4"
          />
          <Text className="text-gray-700 font-medium">{p.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ParticipantsPage;
