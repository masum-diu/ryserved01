import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import instance from '../api/api_instance';
import EventSliderCard from './EventSliderCard';
import useUserLocation from './UserLocation';

const EventSlider = ({ title, subtitle, content, signature }) => {
    const [loading, setLoading] = useState(false);
    const [sliderData, setSliderData] = useState([]);
    const { userLocation, error,calculateDistance } = useUserLocation();
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
    }, [userLocation]);

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
                            console.log(distanceText)
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
