import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NASA_KEY = 'DEMO_KEY';

export default function NasaTriviaScreen() {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [respondida, setRespondida] = useState(null); 
  const [terminado, setTerminado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [recordatorio, setRecordatorio] = useState(null);

  useEffect(() => {
    cargarTrivia();
    cargarRecord();
  }, []);

  const cargarRecord = async () => {
    const r = await AsyncStorage.getItem('trivia_record');
    if (r) setRecordatorio(parseInt(r));
  };

  const cargarTrivia = async () => {
    setCargando(true);
    try {
      // Trae asteroides de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const res = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoy}&end_date=${hoy}&api_key=${NASA_KEY}`
      );
      const data = await res.json();
      const asteroides = Object.values(data.near_earth_objects).flat().slice(0, 5);

      if (asteroides.length < 3) {
        Alert.alert('Sin datos', 'No hay suficientes asteroides hoy, intenta mañana.');
        return;
      }

      const generadas = generarPreguntas(asteroides);
      setPreguntas(generadas);
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con la NASA.');
    }
    setCargando(false);
  };

 
  const generarPreguntas = (asteroides) => {
    const pregs = [];

    asteroides.forEach((a, i) => {
      const nombre = a.name;
      const distanciaKm = Math.round(parseFloat(a.close_approach_data[0].miss_distance.kilometers));
      const diametroM = Math.round(a.estimated_diameter.meters.estimated_diameter_max);
      const esPeligroso = a.is_potentially_hazardous_asteroid;
      const velocidad = Math.round(parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour));

     
      if (i % 3 === 0) {
        pregs.push({
          pregunta: `¿El asteroide ${nombre} está clasificado como potencialmente peligroso?`,
          opciones: ['Sí', 'No'],
          correcta: esPeligroso ? 'Sí' : 'No',
          dato: `Diámetro estimado: ${diametroM} metros`,
        });
      }

      
      if (i % 3 === 1) {
        const distCorrecta = distanciaKm.toLocaleString() + ' km';
        const distFalsa1 = (distanciaKm + 500000).toLocaleString() + ' km';
        const distFalsa2 = (distanciaKm - 300000).toLocaleString() + ' km';
        pregs.push({
          pregunta: `¿A qué distancia pasará el asteroide ${nombre} cerca de la Tierra?`,
          opciones: shuffle([distCorrecta, distFalsa1, distFalsa2]),
          correcta: distCorrecta,
          dato: `Velocidad: ${velocidad.toLocaleString()} km/h`,
        });
      }

     
      if (i % 3 === 2) {
        const velCorrecta = velocidad.toLocaleString() + ' km/h';
        const velFalsa1 = (velocidad + 10000).toLocaleString() + ' km/h';
        const velFalsa2 = (velocidad - 8000).toLocaleString() + ' km/h';
        pregs.push({
          pregunta: `¿A qué velocidad viaja el asteroide ${nombre}?`,
          opciones: shuffle([velCorrecta, velFalsa1, velFalsa2]),
          correcta: velCorrecta,
          dato: `Distancia de paso: ${distanciaKm.toLocaleString()} km`,
        });
      }
    });

    return pregs.slice(0, 5);
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const responder = async (opcion) => {
    if (respondida) return;
    setRespondida(opcion);
    const esCorrecta = opcion === preguntas[indice].correcta;
    if (esCorrecta) setPuntaje(p => p + 1);

    setTimeout(async () => {
      if (indice + 1 >= preguntas.length) {
        setTerminado(true);
        const puntajeFinal = esCorrecta ? puntaje + 1 : puntaje;
        if (recordatorio === null || puntajeFinal > recordatorio) {
          await AsyncStorage.setItem('trivia_record', String(puntajeFinal));
          setRecordatorio(puntajeFinal);
        }
      } else {
        setIndice(i => i + 1);
        setRespondida(null);
      }
    }, 1200);
  };

  const reiniciar = () => {
    setIndice(0);
    setPuntaje(0);
    setRespondida(null);
    setTerminado(false);
    cargarTrivia();
  };

  if (cargando) return (
    <View style={s.centro}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={s.cargandoTxt}>Consultando asteroides reales...</Text>
    </View>
  );

  if (terminado) return (
    <ScrollView contentContainerStyle={s.centro}>
      <Text style={s.emoji}>🏆</Text>
      <Text style={s.titulo}>Trivia terminada</Text>
      <Text style={s.puntajeFinal}>{puntaje} / {preguntas.length} correctas</Text>
      {recordatorio !== null && (
        <Text style={s.record}>Récord: {recordatorio} / {preguntas.length}</Text>
      )}
      <TouchableOpacity style={s.btnReiniciar} onPress={reiniciar}>
        <Text style={s.btnTxt}>Jugar de nuevo</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const preguntaActual = preguntas[indice];

  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <Text style={s.subtitulo}>Pregunta {indice + 1} de {preguntas.length}</Text>
      <Text style={s.titulo}>{preguntaActual.pregunta}</Text>

      {preguntaActual.opciones.map((op) => {
        let color = s.opcion;
        if (respondida) {
          if (op === preguntaActual.correcta) color = s.opcionCorrecta;
          else if (op === respondida) color = s.opcionMal;
        }
        return (
          <TouchableOpacity key={op} style={[s.opcion, color]} onPress={() => responder(op)}>
            <Text style={s.opcionTxt}>{op}</Text>
          </TouchableOpacity>
        );
      })}

      {respondida && (
        <View style={s.datoBox}>
          <Text style={s.datoTxt}>🛸 {preguntaActual.dato}</Text>
        </View>
      )}

      <Text style={s.puntaje}>Puntaje actual: {puntaje}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { padding: 20, backgroundColor: '#0a0a1a', flexGrow: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a1a', padding: 20 },
  titulo: { fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 20, lineHeight: 26 },
  subtitulo: { color: '#888', fontSize: 13, marginBottom: 10 },
  emoji: { fontSize: 60, marginBottom: 16 },
  puntajeFinal: { fontSize: 32, color: '#FFD700', fontWeight: 'bold', marginBottom: 8 },
  record: { color: '#aaa', fontSize: 15, marginBottom: 24 },
  puntaje: { color: '#888', marginTop: 20, textAlign: 'center' },
  cargandoTxt: { color: '#aaa', marginTop: 12 },
  opcion: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  opcionCorrecta: { backgroundColor: '#1a3a1a', borderColor: '#4CAF50' },
  opcionMal: { backgroundColor: '#3a1a1a', borderColor: '#e53935' },
  opcionTxt: { color: '#fff', fontSize: 15, textAlign: 'center' },
  datoBox: { backgroundColor: '#111', borderRadius: 8, padding: 12, marginTop: 8 },
  datoTxt: { color: '#FFD700', fontSize: 13 },
  btnReiniciar: { backgroundColor: '#1a3a6a', padding: 16, borderRadius: 10, marginTop: 16, width: '100%', alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
});