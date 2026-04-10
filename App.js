import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import NasaTriviaScreen from './screens/NasaTriviaScreen';

const MENU_ITEMS = [
  {
    id: 'apod',
    icon: '🌌',
    title: 'Astronomy Picture of the Day',
    subtitle: 'APOD · Imagen diaria',
  },
  {
    id: 'mars',
    icon: '🔴',
    title: 'Mars Rover Photos',
    subtitle: 'Mars Rovers · Fotos de Marte',
  },
  {
    id: 'neo',
    icon: '☄️',
    title: 'Near Earth Objects',
    subtitle: 'NeoWs · Asteroides cercanos',
  },
  {
    id: 'earth',
    icon: '🌍',
    title: 'Earth Imagery',
    subtitle: 'Landsat · Imágenes de la Tierra',
  },
  {
    id: 'trivia',
    icon: '🪐',
    title: 'Trivia NASA',
    subtitle: 'Quiz · Asteroides reales',
  },
];

export default function App() {
  const [screen, setScreen] = useState(null);

  const handlePress = (id) => {
    console.log('Navegando a:', id);
    if (id === 'trivia') setScreen('trivia');
  };

  if (screen === 'trivia') {
    return <NasaTriviaScreen onBack={() => setScreen(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🚀</Text>
          <Text style={styles.headerTitle}>NASA Explorer</Text>
          <Text style={styles.headerSubtitle}>Open APIs</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handlePress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>nasa.gov · Open APIs</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#0d0d2b',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a3a',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#e0e8ff',
    fontSize: 26,
    fontWeight: '500',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#6070a0',
    fontSize: 13,
    marginTop: 4,
  },
  menuContainer: {
    padding: 16,
    gap: 10,
  },
  menuItem: {
    backgroundColor: '#111130',
    borderWidth: 0.5,
    borderColor: '#2a2a5a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    fontSize: 20,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: '#d0d8ff',
    fontSize: 14,
    fontWeight: '500',
  },
  itemSubtitle: {
    color: '#5060a0',
    fontSize: 12,
    marginTop: 2,
  },
  arrow: {
    color: '#3a4a80',
    fontSize: 20,
  },
  footer: {
    color: '#3a4a70',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});