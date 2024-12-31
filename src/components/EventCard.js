import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const EventCard = ({
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
    distance
}) => {

    const navigation = useNavigation();
    // const handlePress = () => {
    //     status === "ON_HOLD" ?
    //         navigation.navigate('ModifyReservation', {
    //             id, resID, distance, status, date,
    //             time,
    //             guest,
    //         }) : "";
    // };
    const handlePress = () => {

        // navigation.navigate('ModifyReservation', {
        //     id, distance, status, date,
        //     time,
        //     guest,title,resID
        // })
    };
    return (
        <TouchableOpacity className=" bg-white mx-4 my-2 shadow rounded-xl " onPress={handlePress}  >
            <Image className="h-36 rounded-t-2xl" source={{ uri: imgUrl }} />
            <View className="px-3 pb-4">
                <View className="pt-2">
                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 18 }}>{title}</Text>
                    <Text className="font-Poppins-Regular" style={{ color: "#B5B5B5", fontSize: 14 }}>{subTitle}</Text>
                    {/* {
                        status === "ON_HOLD" ?
                            <Text className="font-bold text-sm text-orange-500 border p-1 rounded-sm " style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text> : status === "CONFIRMED" ?
                                <Text className="font-bold text-sm  border p-1 rounded-sm text-green-500" style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text> :
                                <Text className="font-bold text-sm  border p-1 rounded-sm text-red-500" style={{ fontSize: 10, fontFamily: "SemiBold" }}>{status}</Text>
                    } */}

                </View>

                <View className="flex-row space-x-3 items-center mt-1 justify-between">
                    <View className="flex-row space-x-1 items-center mt-1 justify-between">
                        {/* <MapPinIcon color={"#DC4A45"} size={14} /> */}
                        <Feather name="map-pin" color="#DC4A45" size={14} />
                        <Text className="text-xs">
                            <Text className="font-Poppins-Light" style={{ color: "#DC4A45", fontSize: 10 }}>{address}</Text>
                        </Text>
                    </View>


                </View>
                {/* <View className="flex-row space-x-16 items-center justify-center mt-3">
                    <View className="flex-col items-center space-y-2">
                        <Image source={require('../../assets/image/Calendar1.png')} style={{ width: 20, height: 20 }} />
                        <Text className="font-Poppins-Medium" style={{ fontSize: 14 }}>{date}</Text>
                    </View>
                    <View className="flex-col items-center space-y-2">
                        <Image source={require('../../assets/image/clock.png')} style={{ width: 20, height: 20 }} />
                        <Text className="font-Poppins-Medium" style={{ fontSize: 14 }}>{time}</Text>
                    </View>
                    <View className="flex-col items-center space-y-2">
                        <Image source={require('../../assets/image/team.png')} style={{ width: 20, height: 20 }} />
                        <Text className="font-Poppins-Medium" style={{ fontSize: 14 }}>{guest} Guests</Text>
                    </View>
                </View> */}
            </View>
        </TouchableOpacity>
    )
}

export default EventCard