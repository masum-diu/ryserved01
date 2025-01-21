import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import AllRestaurantsListCard from './AllRestaurantsListCard'
import { Text } from 'react-native'
import Geolocation from '@react-native-community/geolocation'

const SearchResult = ({ sliderData, loading }) => {
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
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
            }
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

    return (

        <View className=" mt-3">
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator size="large" color="#073064" />

                </View>
            ) : (
                sliderData?.length > 0 ? (
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

    )
}

export default SearchResult
