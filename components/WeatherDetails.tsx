import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeatherDetailsProps {
  description: string;
  humidity: number;
  windSpeed: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ description, humidity, windSpeed }) => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Ionicons name="today-outline" size={30} color="blue" />
        <Text style={styles.title}>Today</Text>
        <Text style={styles.detail}>{description}</Text>
      </View>
      <View style={styles.column}>
        <Ionicons name="water-outline" size={30} color="blue" />
        <Text style={styles.title}>Humidity</Text>
        <Text style={styles.detail}>{humidity}%</Text>
      </View>
      <View style={styles.column}>
        <Ionicons name="wind-outline" size={30} color="blue" />
        <Text style={styles.title}>Wind</Text>
        <Text style={styles.detail}>{windSpeed} m/s</Text>
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
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WeatherDetails;