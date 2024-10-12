import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { ForecastData } from '../app/index';
import { Ionicons } from '@expo/vector-icons';

interface DailyForecastProps {
  forecast: ForecastData;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ forecast }) => {
  const getDailyForecast = () => {
    const dailyData: any = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();

      if (hour >= 9 && hour <= 12) {
        if (!dailyData[day] || (dailyData[day] && Math.abs(12 - hour) < Math.abs(12 - dailyData[day].hour))) {
          dailyData[day] = {
            ...item,
            hour: hour,
            temp_max: item.main.temp,
            temp_min: item.main.temp
          };
        } else {
          dailyData[day].temp_max = Math.max(dailyData[day].temp_max, item.main.temp);
          dailyData[day].temp_min = Math.min(dailyData[day].temp_min, item.main.temp);
        }
      }
    });
    return Object.entries(dailyData).slice(0, 5);
  };

  const dailyForecast = getDailyForecast();

  return (
    <View style={styles.container}>
      {dailyForecast.map(([day, data]: [string, any], index) => (
        <View key={index} style={styles.dayRow}>
          <Text style={styles.dayText}>{index === 0 ? 'Today' : day}</Text>
          <View style={styles.humidityContainer}>
            <Ionicons name="water-outline" size={16} color="blue" />
            <Text style={styles.humidityText}>{data.main.humidity}%</Text>
          </View>
          <Image 
            source={{ uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` }}
            style={styles.weatherIcon}
          />
          <Text style={styles.tempText}>{Math.round(data.temp_max)}°C</Text>
          <Text style={styles.tempText}>{Math.round(data.temp_min)}°C</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 2.5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    width: 80,
    fontSize: 16,
  },
  humidityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
  },
  humidityText: {
    marginLeft: 4,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  tempText: {
    width: 50,
    textAlign: 'center',
  },
});

export default DailyForecast;