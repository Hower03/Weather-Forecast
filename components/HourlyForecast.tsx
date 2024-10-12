import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Dimensions } from 'react-native';
import { ForecastData } from '../app/index';
import { Ionicons } from '@expo/vector-icons';

const HourlyForecast: React.FC<{ forecast: ForecastData }> = ({ forecast }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyForecast}>
      {forecast.list.slice(0, 8).map((item, index) => (
        <View key={index} style={styles.hourlyItem}>
          <Text>{new Date(item.dt * 1000).getHours()}:00</Text>
          <Image 
            source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }} 
            style={styles.hourlyIcon} 
          />
          <Text>{Math.round(item.main.temp)}°C</Text>
          <View style={styles.humidityContainer}>
            <Ionicons name="water-outline" size={16} color="blue" />
            <Text style={styles.humidityText}>{item.main.humidity}%</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hourlyForecast: {
    height: Dimensions.get('window').height / 4,
    marginTop: 20,
  },
  hourlyItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  hourlyIcon: {
    width: 50,
    height: 50,
  },
  humidityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  humidityText: {
    marginLeft: 4,
  },
});

export default HourlyForecast;