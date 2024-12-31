import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const EventSliderCard = ({
    imgUrl,
    title,
    rating,
    genre,
    address,
    short_descr,
    dishes,
    long,
    lat,
    id,
    distance,
}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity className="mr-3 shadow" style={{ width: 242 }} onPress={() => navigation.navigate("ViewEvent", {id})}>
            <Image className="rounded-t-2xl" source={{ uri: imgUrl }} style={{ height: 90 }} />
            <View className="px-3 pb-4 bg-white rounded-b-xl">
                <Text className="font-Poppins-SemiBold pt-2" style={{ fontSize: 10 }}>
                    {title}
                </Text>

                <View className="flex-row space-x-3 items-center mt-1 justify-between">
                    <View className="flex-row space-x-1 items-center mt-1 justify-between">
                        <Feather name="map-pin" color="#DC4A45" size={14} />
                        <Text className="text-xs">
                            <Text className="font-Poppins-Light" style={{ color: '#DC4A45', fontSize: 10 }}>
                                {address}
                            </Text>
                        </Text>
                    </View>
                    <View className="flex-row space-x-1 items-center mt-1">
                        <Ionicons name="navigate-outline" color="#073064" size={14} />
                        <Text  >
                            <Text className=" font-Poppins-Light" style={{ fontSize: 10, color: "#073064" }}>
                                {distance}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default EventSliderCard;
