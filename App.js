import React, { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import NasaCard from "./components/NasaCard";
import NasaHighlight from "./components/NasaHighlight";
import NasaTriviaScreen from "./screens/NasaTriviaScreen";

export default function App() {
  const [screen, setScreen] = useState(null);

  if (screen === "trivia") {
    return <NasaTriviaScreen onBack={() => setScreen(null)} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <NasaHighlight />
        <NasaCard />
      </ScrollView>
    </SafeAreaView>
  );
}