import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const PopularRestaurantsCard = ({
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
    //   const [isLoading, setIsLoading] = useState(true);

    //   // Simulate loading time
    //   useEffect(() => {
    //     const timer = setTimeout(() => setIsLoading(false), 5000); // Simulate a 2-second loading time
    //     return () => clearTimeout(timer);
    //   }, []);

    //   if (isLoading) {
    //     // Tailwind-based Skeleton Placeholder
    //     return (
    //       <View className="mr-3 shadow bg-white rounded-2xl" style={{ width: 242 }}>
    //         {/* Skeleton for Image */}
    //         <View className="bg-gray-300 rounded-t-2xl w-full h-24 animate-pulse"></View>

    //         {/* Skeleton for Content */}
    //         <View className="p-3">
    //           {/* Title Skeleton */}
    //           <View className="bg-gray-300 h-3 w-3/5 rounded-md animate-pulse my-2"></View>

    //           {/* Address Skeleton */}
    //           <View className="flex-row justify-between items-center mt-2">
    //             <View className="flex-row items-center space-x-2">
    //               <View className="bg-gray-300 h-3 w-16 rounded-md animate-pulse"></View>
    //             </View>
    //             <View className="flex-row items-center space-x-2">
    //               <View className="bg-gray-300 h-3 w-10 rounded-md animate-pulse"></View>
    //             </View>
    //           </View>
    //         </View>
    //       </View>
    //     );
    //   }

    return (
        <TouchableOpacity className="mr-3 shadow" style={{ width: 242 }}>
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
                            <Text className=" font-Poppins-Light" style={{ fontSize: 10,color:"#073064" }}>
                                {distance}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PopularRestaurantsCard;
