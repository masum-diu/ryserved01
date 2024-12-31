import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import instance from '../../api/api_instance';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../util/AuthContext';

const CancelReservation = () => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    // console.log(data)

    const route = useRoute()
    const { distance, id, resID, updateStats, date,
        time,
        guest, title, } = route.params || {}

    useEffect(() => {
        setIsLoading(true); // Set loading state to true when API request starts

        instance.get(`/property/${resID}`)
            .then(response => {
                setData(response?.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading state to false when API request finishes
            });
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const { width, height } = Dimensions.get('window');
    //  const { setSubID } = useAuth()
    const handlePress = () => {
        // setSubID(resID),
        navigation.navigate("ViewRestaurant", { resID })

    };
    const handlePress1 = () => {

        navigation.navigate('Home', { screen: 'Explore' })

    };

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#E6EAF0" }}>
            <ScrollView>
                <View className="p-4">
                    {/* <TouchableOpacity className="bg-white  h-8 w-8 flex-row items-center justify-center rounded-md" onPress={() => navigation.goBack()} >
                        <ChevronLeftIcon color={"#073064"} size={20} />
                    </TouchableOpacity> */}
                    <View className=" p-6 bg-white   bottom-0 mt-4" style={{ width: width * 0.92, borderRadius: 12, elevation: 2 }}>

                        <Text className="font-Poppins-SemiBold text-lg text-center" >
                            {title}
                        </Text>


                        <View className="flex-row items-center justify-center space-x-1">
                            {/* <XCircleIcon color={"red"} size={14} /> */}
                            <Text className="font-Poppins-Light" style={{ fontSize: 12, color: "red" }}>Reservation <Text className="lowercase">{updateStats}</Text> </Text>
                        </View>


                        <View className="flex-row  items-center justify-between mt-3" >

                            <View className="flex-row items-center space-x-2">
                                <Image source={require('../../../assets/image/Calendar1.png')} style={{ width: 20, height: 20 }} />
                                <Text className="font-Poppins-Medium text-sm" >{date}</Text>
                            </View>

                            <View className="flex-row items-center space-x-2">
                                <Image source={require('../../../assets/image/team.png')} style={{ width: 20, height: 20 }} />
                                <Text className="font-Poppins-Medium text-sm" >{guest} Guest</Text>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <Image source={require('../../../assets/image/clock.png')} style={{ width: 20, height: 20 }} />
                                <Text className="font-Poppins-Medium text-sm" >{time}</Text>
                            </View>

                        </View>



                    </View>

                    {isLoading ? <View style={{ paddingVertical: 20 }}>
                        <Text className="text-center">Loading...</Text>
                    </View> : <View className="pt-5 space-y-3">

                        <Text className="font-Poppins-SemiBold text-left" style={{ fontSize: 22 }}>
                            {data?.listingName}
                        </Text>
                        <Text className="text-sm text-left font-Poppins-Light" style={{ color: "#B5B5B5" }}>
                            {data?.title}
                        </Text>

                        <View className="flex-row  space-x-1">
                            {/* <MapPinIcon color={"#DA4A54"} size={12} /> */}
                            <Text className="font-Poppins-Light" style={{ color: "#DA4A54", fontSize: 12 }}>{data?.branches[0]?.address}</Text>

                        </View>

                        {/* <View className="flex-row items-center space-x-2">
                            <PhoneIcon color={"#073064"} size={12} />
                            <Text style={{ color: "#073064", fontFamily: "Medium", fontSize: 12 }}>{data?.branches[0]?.businessManager}</Text>
                        </View> */}
                        <View className="space-y-2 mb-4" >
                            <Text className="text-lg font-Poppins-SemiBold" style={{ color: "#073064", }}>About</Text>
                            <Text className=" text-justify font-Poppins-Light" style={{ color: "#979797", fontSize: 14 }}>{data?.description}</Text>
                        </View>
                        <View className="space-y-2 mb-4" >
                            <Text className="font-Poppins-SemiBold" style={{ color: "#073064", fontSize: 16 }}>Opportunities</Text>
                            <View className="flex-row flex-wrap">
                                {data?.branches[0]?.amenities?.map((item, index) => <Text className=" flex-row capitalize font-Poppins-Light" key={index} style={{ color: "#979797", fontSize: 14 }}>{item?.name}, </Text>)}
                            </View>


                        </View>
                        <View className="space-y-2 mb-4" >
                            <Text className=" font-Poppins-SemiBold" style={{ color: "#073064", fontSize: 16 }}>Opening hours</Text>
                            <View className="flex-row items-center space-x-2">
                                <View className="flex-row items-center space-x-1">
                                    {/* <ClockIcon color={"orange"} /> */}
                                    <Feather name="clock" color="#E49542" size={20} />
                                    <Text className=" font-Poppins-Medium" style={{ color: "#979797", fontSize: 14 }}> 10:00 AM - 11:00 PM </Text>
                                </View>
                                <View className="flex-row items-center space-x-1">
                                    {/* <CalendarDaysIcon color={"#DA4A54"} /> */}
                                    <Feather name="calendar" color="#DA4A54" size={20} />
                                    <Text className=" font-Poppins-Medium" style={{ color: "#979797", fontSize: 14 }}> Saturday - Friday </Text>
                                </View>

                            </View>

                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity className="mt-4 mb-3" style={{ backgroundColor: '#073064', padding: 10, width: width * .45, borderRadius: 8 }} onPress={handlePress} >
                                <Text className="font-Poppins-Medium" style={{ fontSize: 12, textAlign: "center", color: "#ffff", }}>Book Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="mt-4 mb-3 " onPress={handlePress1} style={{
                                padding: 10, width: width * .44, borderRadius: 8, borderWidth: 1,
                                borderColor: '#073064',
                            }}  >
                                <Text className="font-Poppins-Medium" style={{ fontSize: 12, textAlign: "center", color: "#073064", }}>Explore</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }


                    {/* <TouchableOpacity className="mt-4 mb-3" style={[styles.getStartedButton, { opacity: checked ? 1 : 0.5 }]} onPress={handleReservePress} disabled={!checked}>
        <Text style={styles.buttonText}>Reserve Confirm</Text>
    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CancelReservation