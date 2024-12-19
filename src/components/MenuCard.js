import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'

const MenuCard = ({
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
    onPress, 
}) => {
    const navigation = useNavigation();
    return (
        <View className=" bg-white shadow flex-row my-2  rounded-2xl"   >
            <View className="relative">
                <Image className="rounded-l-2xl" style={{ width: 150, height: 110 }} source={{ uri: imgUrl }} />
                <TouchableOpacity onPress={onPress} className="absolute bottom-2 right-2 p-1" style={{ backgroundColor: "#fff", borderRadius:4, }}>
                    <Ionicons  name='add-outline' size={20}  />
                </TouchableOpacity>
            </View>

            <View className="px-2  flex-1 space-y-1">
                <Text className="font-Poppins-Medium  pt-2" style={{ fontSize: 12 }}>{title}</Text>
                <Text className="text-xs">
                    <Text className="font-Poppins-SemiBold" style={{ color: "#B5B5B5", fontSize: 10 }}>TK {address}</Text>
                </Text>
                <Text className="text-xs text-gray-500">
                    <Text className=" text-geen-500 font-Poppins-Regular" style={{ fontSize: 10 }}>{rating.slice(0, 60)}..</Text>
                </Text>

            </View>
        </View>
    )
}

export default MenuCard