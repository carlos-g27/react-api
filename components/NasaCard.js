import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";

export default function NasaCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNasaData = async () => {
    try {
      const res = await fetch(
        "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
      );
      const json = await res.json();

      // 👇 evitar errores si no es imagen
      if (json.media_type !== "image") {
        setLoading(false);
        return;
      }

      setData(json);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNasaData();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  if (!data) return <Text>No hay imagen hoy</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Image source={{ uri: data.url }} style={styles.image} />
      <Text style={styles.date}>{data.date}</Text>
      <Text style={styles.text}>{data.explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
});