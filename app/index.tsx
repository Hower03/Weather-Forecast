import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import SunriseSunset from '../components/SunriseSunset';
import WeatherDetails from '../components/WeatherDetails';

const API_KEY = '';

type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
};

export type ForecastData = {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
};

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    fetchNearestCity(location.coords.latitude, location.coords.longitude);
    console.log(location.coords.latitude, location.coords.longitude);
  };

  const fetchNearestCity = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=1&units=metric&appid=${API_KEY}`
      );
      if (response.data.list && response.data.list.length > 0) {
        const nearestCity = response.data.list[0];
        fetchWeatherData(nearestCity.id);
        console.log(nearestCity.id);
      } else {
        Alert.alert('Error', 'No nearby cities found');
      }
    } catch (error) {
      console.error('Error fetching nearest city:', error);
      Alert.alert('Error', 'Failed to fetch nearest city');
    }
  };

  const fetchWeatherData = async (cityId: number) => {
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${API_KEY}`)
      ]);
      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      Alert.alert('Error', 'Failed to fetch weather data');
    }
  };

  if (!weatherData) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const weatherIcon = weatherData.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  const getDayAndDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleDateString()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{weatherData.name}</Text>
          <Text>{getDayAndDate(weatherData.dt)}</Text>
          <Text>{new Date(weatherData.dt * 1000).toLocaleTimeString()}</Text>
        </View>
        <TouchableOpacity onPress={getLocationAndWeather} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.mainInfo}>
        <View>
          <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text>{Math.round(weatherData.main.temp_max)}°C/{Math.round(weatherData.main.temp_min)}°C</Text>
          <Text>Feels like: {Math.round(weatherData.main.feels_like)}°C</Text>
          {/* <Text>{weatherData.weather[0].description}</Text> */}
        </View>
        <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
      </View>
      {forecastData && <HourlyForecast forecast={forecastData} />}
      {forecastData && <DailyForecast forecast={forecastData} />}
      {weatherData && <SunriseSunset sunrise={weatherData.sys.sunrise} sunset={weatherData.sys.sunset} />}
      {weatherData && (
        <WeatherDetails 
          description={weatherData.weather[0].description}
          humidity={weatherData.main.humidity}
          windSpeed={weatherData.wind.speed}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});