import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AllRestaurantsListCard from '../../components/AllRestaurantsListCard';
import instance from '../../api/api_instance';
import Geolocation from '@react-native-community/geolocation';

const CategoryPageScreen = ({ navigation }) => {
    const route = useRoute();
    const { category } = route.params;
    const [loading, setLoading] = useState(true);
    const [sliderData, setSliderData] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    useEffect(() => {
        // Fetch location only once on component mount
        Geolocation.getCurrentPosition(
            (info) => {
                const { latitude, longitude } = info.coords;
                setUserLocation({ latitude, longitude });

            },
            (error) => {
                // console.error('Error getting location:', error);
                // Alert.alert('Location Error', error.message);
            },
           
        );
    }, []); // Empty dependency array ensures this runs only once

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
    const fetchDatacuisine = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/RESTAURANT/search?cuisine=${category}&pageNo=1&perPage=8`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSliderData(response?.data?.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatacuisine();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <ScrollView style={{ backgroundColor: "#E6EAF0" }} bounces={false}
            overScrollMode="never">
            <View className="p-4 space-y-4">
                <View className="flex-row justify-between items-center mb-5">
                    <TouchableOpacity
                        className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md"
                        style={{ borderColor: '#DBDBDB', borderWidth: 1 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back-outline" size={20} />
                    </TouchableOpacity>
                    <Text> </Text>
                    <Text className="font-Poppins-SemiBold">{category}</Text>
                    <Text> </Text>
                    <Text> </Text>
                </View>

                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <ActivityIndicator size="large" color="#073064" />
                        <Text className="font-Poppins-Light">Loading...</Text>
                    </View>
                ) : (
                    sliderData.length > 0 ? (
                        sliderData?.map((item, index) => {
                            const distance = userLocation
                                ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(item?.branches?.[0]?.latitude), parseFloat(item?.branches?.[0]?.longitude))
                                : null;
                            const distanceText = distance ? `${distance} km` : 'Unknown';
                            const distanceInMeters = distance ? parseFloat(distance) < 1 ? `${Math.round(parseFloat(distance) * 1000)} m` : distanceText : 'Unknown';
                            return (
                                <AllRestaurantsListCard
                                    key={index}
                                    imgUrl={item?.images?.[0]?.link}
                                    title={item?.listingName}
                                    id={item?.id}
                                    address={item?.branches?.[0]?.area}
                                    rating={4.7}
                                    distance={distanceInMeters}
    
                                />
    
                            )
                        })
                    ) : (
                        
                            <Text className="font-Poppins-Light text-center">No data available</Text>

                    )
                )}
            </View>
        </ScrollView>
    );
};

export default CategoryPageScreen;
