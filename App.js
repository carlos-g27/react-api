import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import NasaCard from "./components/NasaCard";
import NasaHighlight from "./components/NasaHighlight";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <NasaHighlight />
        <NasaCard />
      </ScrollView>
    </SafeAreaView>
  );
}