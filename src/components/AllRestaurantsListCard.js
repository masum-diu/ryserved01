import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'

const AllRestaurantsListCard = ({
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
    distance
}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity className=" bg-white  shadow flex-row  mb-4  rounded-2xl" onPress={()=>navigation.navigate("ViewRestaurant",)} >
            <Image className="rounded-l-2xl" style={{ width: 150, height: 110 }} source={{ uri: imgUrl }} />
            <View className="px-3 pb-4 flex-1 ">
                <Text className="font-Poppins-Medium text-lg pt-2" style={{ fontSize: 14 }}>{title}</Text>
                <View className="flex-col space-x-3 mt-1">
                    <View className="flex-row space-x-1 items-center mt-1">
                    <Feather
                            name='map-pin'
                            color={"#DC4A45"} size={14}
                        />
                        <Text className="text-xs">
                            <Text className="font-Poppins-Light" style={{ color: "#B5B5B5", fontSize: 10,}}>{address}</Text>
                        </Text>
                    </View>


                </View>
                <View className="flex-row pt-3 justify-between">
                    <View className="flex-row space-x-1 items-center mt-1">
                        <Ionicons
                            name='star'
                            color={"#F5A524"} size={14}
                        />
                        <Text className="text-xs text-gray-500">
                            <Text className=" text-geen-500 font-Poppins-Regular" style={{ fontSize: 10,  }}>{rating} </Text>
                        </Text>
                    </View>
                    <View className="flex-row space-x-1 items-center mt-1">
                    <Ionicons
                            name='navigate'
                            color={"#073064"} size={14}
                        />
                        {/* <Image source={require('../assets/send.png')} style={{ width: 10, height: 10 }} /> */}
                        <Text className="text-xs text-gray-500">
                            <Text className=" text-geen-500 font-Poppins-Regular" style={{ fontSize: 10,  }}>{distance}</Text>
                        </Text>
                    </View>


                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AllRestaurantsListCard