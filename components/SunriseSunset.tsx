import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SunriseSunsetProps {
  sunrise: number;
  sunset: number;
}

const SunriseSunset: React.FC<SunriseSunsetProps> = ({ sunrise, sunset }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.title}>Sunrise</Text>
        <Ionicons name="sunny-outline" size={50} color="orange" />
        <Text style={styles.time}>{formatTime(sunrise)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>Sunset</Text>
        <Ionicons name="moon-outline" size={50} color="purple" />
        <Text style={styles.time}>{formatTime(sunset)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  column: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default SunriseSunset;