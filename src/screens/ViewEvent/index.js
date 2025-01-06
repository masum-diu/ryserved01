import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../api/api_instance';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../../components/CustomModal';
const ViewEvent = ({ navigation }) => {
    const [singleData, setSingleData] = useState([])
    // console.log(singleData)
    const [count, setCount] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const route = useRoute();
    const { width, height } = Dimensions.get('window');
    const { id } = route.params;
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        Number: '',

    });

    function formatDateRange(dateStart, dateEnd) {
        const options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        const start = new Date(dateStart);
        const end = new Date(dateEnd);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            // console.error("Invalid date values", { dateStart, dateEnd });
            return "Invalid Date Range";
        }
        const startFormatted = new Intl.DateTimeFormat('en-US', options).format(start);
        const endFormatted = new Intl.DateTimeFormat('en-US', options).format(end);

        return `${startFormatted}-${endFormatted}`;
    }

    const formattedDateRange = formatDateRange(singleData?.startDate, singleData?.endDate);

    const incrementCount = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const decrementCount = () => {
        // Ensure count doesn't go below 1
        setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    };
    const handleChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }
    const fetchSingleData = async () => {

        try {
            const storedToken = await AsyncStorage.getItem('token');
            setLoading(true);
            const response = await instance.get(`/event/${id}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSingleData(response?.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingleData();
    }, []);
    const handleReservePress = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (!storedToken) {
                setIsModalVisible(true);
            }
            else if (storedToken) {
                const response = await instance.post('/event/booking', {
                    eventId: id,
                    username: formData.fullName,
                    phoneNumber: formData.Number,
                    email: formData.email,
                    amount: 0,
                    vat: 0,
                    discount: 0,
                    price: 0,
                    person: count,
                    payStatus: "UNPAID",
                    eventDate: singleData?.startDate,
                    menuData: [{ data: "no content" }],
                    bookingStatus: "ON_HOLD",
                    issueAt: singleData?.startDate,
                    status: "true",

                }, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data) {
                    // console.log(response?.data)
                    navigation.navigate('Home', { screen: 'Reservation' });
                    // if (segmentClient && segmentClient.track) {
                    //     segmentClient.track('Reservation status', { param1: 'value2' });
                    // } else {
                    //     console.error('Segment client or track method is not available');
                    // }


                }
            }
            // Handle response as needed
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    };
    if (loading) {
        return (
            <View className="h-full flex-row justify-center items-center">
                <ActivityIndicator size="large" color="#073064" />
            </View>
        );
    }
    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#E6EAF0", }}>
            <ScrollView overScrollMode="never">
                <View className="relative">

                    {/* <Image
className="rounded-b-xl"
source={{ uri: data?.image[0]?.link }}  
style={{ width: "100%", height: 280, }} // Set your desired width and height
/> */}
                    <ScrollView horizontal={true} >
                        {singleData?.images?.map((image, index) => (
                            <Image
                                className="rounded-b-xl"
                                key={index}
                                source={{ uri: image }}
                                style={{ width: width, height: 280, }}
                            />
                        ))}
                    </ScrollView>

                    <TouchableOpacity className="bg-white absolute mx-3 mt-4 h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }} onPress={() => navigation.goBack()} >
                        <Ionicons name="chevron-back-outline" size={20} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity className="bg-white absolute mr-3 mt-4 right-0 h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }}  >
                        <Ionicons name="bookmark-outline" size={20} />
                    </TouchableOpacity> */}



                    {/* <AllRestaurantsList /> */}
                </View>
                <View className="relative h-14 flex justify-center items-center">

                    <View className=" p-4 bg-white absolute  bottom-0 " style={{ width: width * 0.90, borderRadius: 12, elevation: 2 }}>
                        <View className="flex-row justify-between items-center" >
                            <Image

                                source={{ uri: singleData?.property?.logo }}
                                style={{ width: 35, height: 35, borderRadius: 4 }} // Set your desired width and height
                            />
                            <View >
                                <Text className="font-Poppins-SemiBold text-left" style={{ fontSize: 16 }} >
                                    {singleData?.evtName}
                                </Text>
                                <Text className="font-Poppins-SemiBold text-left" style={{ color: "#B5B5B5", fontSize: 10 }}>
                                    {formattedDateRange}
                                </Text>
                                <Text className="font-Poppins-Medium text-left" style={{ fontSize: 11 }}>
                                    Event by {singleData?.property?.listingName}, {singleData?.location}
                                </Text>
                            </View>
                            <Text></Text>
                        </View>
                        <View className="flex-row pt-2 items-center  space-x-4 justify-center" >
                            <Text className="flex-row items-center" style={{ color: "#DC4A45", fontFamily: "Light" }}>
                                {/* <MapPinIcon color={"#DC4A45"} size={14} /> {data?.asset?.area} */}
                                {/* Event by {singleData?.property?.listingName},{singleData?.location} */}
                            </Text>
                            <Text className="flex-row items-center" style={{ color: "#073064", fontFamily: "Light" }}>
                                {/* <Image source={require('../assets/send.png')} style={{ width: 12, height: 12 }} /> {distance} */}
                            </Text>

                            <View className="space-x-1" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {/* {isOpenToday() ? ( // If today is an off day, display as closed
                <>
                    <XCircleIcon color={"#FF0000"} size={14} />
                    <Text style={{ color: "#FF0000", fontFamily: "Light" }}>Closed</Text>
                </>
            ) : ( // Otherwise, display as open
                <>
                    <CheckCircleIcon color={"#17C964"} size={14} />
                    <Text style={{ color: "#17C964", fontFamily: "Light" }}>Open</Text>
                </>
            )} */}
                            </View>


                        </View>

                    </View>
                </View>
                <View className="p-4">
                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Full Name</Text>
                    <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                        <Ionicons name="person-outline" size={20} color="#041D3C" />
                        <TextInput
                            placeholder="Type your name"
                            value={formData.fullName}
                            onChangeText={(text) => handleChange('fullName', text)}
                            className="flex-1 font-Poppins-Light"

                        />
                    </View>
                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Email</Text>
                    <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                        <Ionicons name="mail-outline" size={20} color="#041D3C" />
                        <TextInput
                            placeholder="Type your email"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            className="flex-1 font-Poppins-Light"

                        />
                    </View>
                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Phone Number</Text>
                    <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                        <Ionicons name="call-outline" size={20} color="#041D3C" />
                        <TextInput
                            placeholder="Type your phone number"
                            value={formData.Number}
                            onChangeText={(text) => handleChange('Number', text)}
                            className="flex-1 font-Poppins-Light"

                        />
                    </View>
                    <View className="space-y-2 ">
                        <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Guest</Text>
                        <View className="bg-white flex-row  items-center justify-between p-1 rounded-lg" style={{ width: 130, borderColor: "#073064", borderWidth: 1, borderRadius: 8 }}>
                            <TouchableOpacity onPress={decrementCount}>
                                <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, borderColor: "#073064", borderWidth: 2, color: "#073064", borderRadius: 8 }}>-</Text>
                                {/* <Image source={require('../assets/minas.png')} style={{ width: 30, height: 30 }} /> */}
                            </TouchableOpacity>
                            <Text className="font-Poppins-SemiBold text-md" >{count}</Text>
                            <TouchableOpacity onPress={incrementCount}>
                                <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, borderColor: "#073064", borderWidth: 2, color: "#073064", borderRadius: 8 }}>+</Text>
                                {/* <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30 }} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleReservePress}
                        className="bg-[#073064] mt-5 w-full rounded-lg flex-row justify-center items-center"
                        style={{ height: 50 }}
                    >
                        <Text className="text-white text-center font-Poppins-SemiBold">
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
            <CustomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
        </SafeAreaView>
    )
}; const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Buttons: {
        backgroundColor: '#073064',
        height: 50,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        flex: 1
    },
    buttonTexts: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        // fontWeight: 'bold',

    },
    // input: {

    //     borderColor: '#073064',
    //     borderWidth: 2,
    //     backgroundColor: "#FFF",
    //     textAlign: 'center',
    //     borderRadius: 8,

    // },
    input: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#073064',
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        width: "100%"
    },
    input1: {
        // borderWidth: 1,
        // borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        width: "100%"
    },
    digitInput: {
        height: 60,
        width: 60,
        borderColor: '#073064',
        borderWidth: 1,
        // marginBottom: 20,
        textAlign: 'center',
        borderRadius: 12,
        backgroundColor: "#E6EAF0",
        fontSize: 26,
        color: "#073064",

    },
});

export default ViewEvent