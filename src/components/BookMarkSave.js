import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BookMarkSave = ({
    imgUrl,
    title,
    rating,
    genre,
    address,
    short_descr,
    dishes,
    long,
    lat,
    subTitle,
    date,
    time,
    guest,
    id,
    resID,
    status,
    distance,
    onDelete
}) => {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate("ViewRestaurant", { id })

        
    };

    return (
        <TouchableOpacity className=" bg-white m-3 shadow rounded-xl  " onPress={() => handlePress()}  >
            <Image className="h-36 rounded-t-2xl relative" source={{ uri: imgUrl }} />
            <TouchableOpacity className=" bg-white m-4 absolute right-0 p-1" style={{ borderRadius: 4 }} onPress={() => onDelete()}>
                <Ionicons name="ellipsis-horizontal-outline" size={20} />
            </TouchableOpacity>
            <View className="px-3 pb-4">
                <View className=" pt-2">
                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>{title}</Text>
                    <Text className="font-Poppins-Light " style={{ color: "#B5B5B5", fontSize: 12 }}>{subTitle}</Text>
                    {/* {
                        status === "ON_HOLD" ?
                            <Text className="font-bold text-sm text-orange-500 border p-1 rounded-sm " style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text> : status === "CONFIRMED" ?
                                <Text className="font-bold text-sm  border p-1 rounded-sm text-green-500" style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text> :
                                <Text className="font-bold text-sm  border p-1 rounded-sm text-red-500" style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text>
                    } */}

                </View>

                <View className="flex-row space-x-3 items-center mt-1">
                    <View className="flex-row space-x-1 items-center mt-1 justify-between">
                        {/* <MapPinIcon color={"#DC4A45"} size={14} /> */}
                        <Text className="text-xs">
                            <Text className="text-light" style={{ color: "#DC4A45", fontFamily: 'Light' }}>{address}</Text>
                        </Text>
                    </View>
                    <View className="flex-row space-x-1 items-center mt-1 ">
                        {/* <Image source={require('../assets/send.png')} style={{ width: 10, height: 10 }} /> */}
                        <Text className="text-xs text-gray-500">
                            <Text className=" text-geen-500" style={{ fontFamily: "Light", fontSize: 12 }}>{distance}</Text>
                        </Text>
                    </View>


                </View>

            </View>
        </TouchableOpacity>
    )
}

export default BookMarkSave