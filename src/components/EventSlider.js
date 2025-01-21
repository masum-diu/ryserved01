import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import instance from '../api/api_instance';
import EventSliderCard from './EventSliderCard';
import Geolocation from '@react-native-community/geolocation';

const EventSlider = ({ title, subtitle, content, signature }) => {
    const [loading, setLoading] = useState(false);
    const [sliderData, setSliderData] = useState([]);
    //  console.log(sliderData)
    const [userLocation, setUserLocation] = useState(null);
    console.log(userLocation)
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };
    useEffect(() => {
        const fetchLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                console.log('Location permission not granted');
                return;
            }

            Geolocation.getCurrentPosition(
                (info) => {
                    const { latitude, longitude } = info.coords;
                    setUserLocation({ latitude, longitude });
                },
                // (error) => {
                //   console.error('Error getting location:', error);
                //   Alert.alert('Location Error', error.message);
                // },

            );
        };

        fetchLocation();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        // Convert distance to meters if the unit is 'm'
        if (unit === 'm') {
            distance *= 1000;
        }

        return distance.toFixed(2); // Distance rounded to 2 decimal places

    };
    const fetchSliderData = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/event?signature=${signature}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSliderData(response?.data?.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliderData();
    }, []);

    return (
        <View>
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12 }}>{title}</Text>
            <Text className="font-Poppins-Medium px-4" style={{ fontSize: 10, color: "#B5B5B5" }}>{subtitle}</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#073064" />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {sliderData.length > 0 ? (
                        sliderData?.map((item, index) => {
                            const distance = userLocation
                                ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(item?.latitude), parseFloat(item?.longitude))
                                : null;
                            const distanceText = distance ? `${distance} km` : 'Unknown';
                            const distanceInMeters = distance ? parseFloat(distance) < 1 ? `${Math.round(parseFloat(distance) * 1000)} m` : distanceText : 'Unknown';
                            return (
                                <EventSliderCard
                                    key={index}
                                    imgUrl={item?.images?.[0]}
                                    title={item?.evtName}
                                    id={item?.id}
                                    address={item?.location}
                                    distance={distanceInMeters}
                                />
                            )
                        })
                    ) : (
                        <Text className="font-Poppins-Light" style={{ padding: 10, color: "#B5B5B5" }}>No data available</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default EventSlider;
