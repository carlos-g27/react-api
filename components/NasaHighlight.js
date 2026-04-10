import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function NasaHighlight() {
  const [data, setData] = useState(null);

  const fetchNasaData = async () => {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    );
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchNasaData();
  }, []);

  if (!data) return <Text>Cargando...</Text>;

  // 🔥 FUNCIÓN ORIGINAL
  const isSpaceRelated = data.title.toLowerCase().includes("galaxy");

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🌌 NASA DESTACADO</Text>

      <Image source={{ uri: data.url }} style={styles.image} />

      {/* 🔥 LÓGICA ORIGINAL */}
      <Text style={styles.badge}>
        {isSpaceRelated ? "✨ Imagen de galaxia" : "🚀 Otro contenido espacial"}
      </Text>

      <Text>{data.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 150,
    marginVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    color: "purple",
    marginBottom: 5,
  },
});