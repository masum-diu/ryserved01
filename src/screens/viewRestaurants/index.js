import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../../components/CategoryCard';
import { useRoute } from '@react-navigation/native';
import instance from '../../api/api_instance';
import CalenderComponents from '../../components/CalenderComponents';
import CustomSelectList from '../../components/CustomSelectList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../components/CustomModal';
import MenuList from '../../components/MenuList';
import Amenities from '../../components/Amenities';
import Overview from '../../components/Overview';

const ViewRestaurant = ({ navigation }) => {
    const [singleData, setSingleData] = useState([])
    const [switchtigger, setSwithTigger] = useState(false)
    const [singleDataEvent, setSingleDataEvent] = useState([])
    const [bookingType, setBookingType] = useState('Regular');
    const [timeslot, setTimeslot] = useState([])
    const [selectDate, setSelectDate] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    // console.log(selectedOption)
    const [loading, setLoading] = useState(false)
    const route = useRoute();
    const { id, resID } = route.params;
    // console.log(id)
    const [selectedCategory, setSelectedCategory] = useState('Reservation');
    const [count, setCount] = useState(1);
    const [todaySlot, setTodaySlot] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [tableId, setTableId] = useState(null)
    const { width, height } = Dimensions.get('window');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dateString = selectDate;
    const positions = singleData?.branches?.[0]?.tables?.map(table => ({
        id: table?.id,
        position: table?.position,
    })) || [];
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        Number: '',

    });

    const handleChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }
    // console.log(positions)
    // useEffect(() => {

    //     if (singleData && Array.isArray(singleData.slot)) {
    //         const date = new Date(dateString);
    //         const dayOfWeekNumber = date.getDay();
    //         const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    //         const today = daysOfWeek[dayOfWeekNumber];


    //         // Find slots for today
    //         const todaySlots = singleData.slot.find(daySlots => daySlots.hasOwnProperty(today));

    //         if (todaySlots && todaySlots[today]) {
    //             // Extracting only the times for today
    //             const availableTimes = todaySlots[today]
    //                 .filter(slot => slot?.status) // Filter out only available slots
    //                 .map(slot => slot?.slottime); // Extract slot times

    //             // Update state with available times for today
    //             setTimeslot(availableTimes);

    //             // console.log(availableTimes); // Print or use the available times as needed
    //         } else {
    //             setTimeslot([]);
    //             // console.log("No slots available for today.");
    //         }
    //     } else {
    //         setTimeslot([]);
    //         // console.log("No data available or incorrect data format.");
    //     }
    // }, [dateString, singleData]); // Add dependencies: dateString and getdata

    useEffect(() => {
        const fetchAvailableSlots = () => {
            if (!singleData.slot || !dateString) return setTimeslot([]);
            const day = new Date(dateString).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
            const slotsForDay = singleData.slot.find(slot => slot[day]);
            const availableTimes = slotsForDay?.[day]?.filter(s => s?.status)?.map(s => s?.slottime) || [];
            setTimeslot(availableTimes);
        };
        fetchAvailableSlots();
    }, [dateString, singleData]);

    useEffect(() => {
        // console.log("getdata:", getdata); // Log the entire getdata object
        // if (singleData?.tables.length > 0) {
        //     const table = singleData?.tables[0]?.id;
        //     setTableId(table)
        //     // console.log("Table ID:", table);
        // }
    }, [singleData]);

    // const handleTimeSlotPress = (slot) => {

    //     setSelectedSlot(slot === selectedSlot ? null : slot);
    //     setTodaySlot(slot === selectedSlot ? null : slot);
    // };
    const handleTimeSlotPress = (slot, eventName) => {
        setBookingType(eventName);
        if (selectedCategory === 'Reservation') {
            setSelectedSlot(slot === selectedSlot ? null : slot);
            setTodaySlot(slot === selectedSlot ? null : slot);
        }
        //  else if (selectedCategory === 'Amenities' && getdata?.event?.slot) {
        //  setTodaySlot(getdata.event.slot === slot ? null : getdata.event.slot);


        // }
    };

    // console.log(bookingType) 

    // console.log(getdata?.id)

    const incrementCount = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const decrementCount = () => {
        // Ensure count doesn't go below 1
        setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    };
 console.log(id)
    const fetchSingleData = async () => {

        try {
            const storedToken = await AsyncStorage.getItem('token');
            setLoading(true);
            const response = await instance.get(`/property/${id || resID}`, {
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
        fetchSingleDataevent()
    }, []);
    const handleCategoryPress = (category) => {
        // Toggle the selected category
        setSelectedCategory(selectedCategory === category ? category : category);
        fetchSingleDataevent()
        setSwithTigger(null)
    };

    const authCheck = async () => {
        const token = await AsyncStorage.getItem('token');
        return token !== null && token !== undefined;
    };
    const overview = {
        description: singleData?.description,
        terms: singleData?.terms,
        amenities: singleData?.branches?.[0]?.amenities || [],
        address: singleData?.branches?.[0]?.address || "Address not available",
    };
    const restaurantname = { restaurantname: singleData?.listingName }
    const bookingInfo = {

        // subAssetCompId: getdata?.id,
        tableId: selectedOption,
        branchId: singleData?.branches?.[0]?.id,
        startDate: formatDate(selectDate),
        endDate: formatDate(selectDate),
        guestNumber: count,
        slot: todaySlot,
        // seatBedId: "",
        amount: 0,
        vat: 0,
        discount: 0,
        grandTotal: 0,
        customerRequest: "test",
        status: "ON_HOLD",
        bookingType: bookingType,
        trams: singleData?.terms
    }
    // console.log(bookingInfo, "booking")
    const handleMoreTabPress = async () => {
        const isAuthenticated = await authCheck();
        if (!isAuthenticated) {
            setIsModalVisible(true);
            // navigation.navigate('ReserveConfirm');
        } else if (bookingInfo) {
            navigation.navigate('ReserveConfirm', { bookingInfo, restaurantname });
        }
    };

    // event area
    const eventid = singleData?.event?.[0]?.id;
    if (eventid !== undefined) {
    }
    const fetchSingleDataevent = async () => {
        if (!eventid) return;
        try {
            const storedToken = await AsyncStorage.getItem('token');
            setLoading(true);
            const response = await instance.get(`/event/${eventid}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSingleDataEvent(response?.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleWishListPress = async () => {
        try {
            setLoading(true)
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                const response = await instance.post(`/wishlist`, {
                    type: singleData?.type,
                    propertyId: singleData?.branches[0]?.propertyId,
                    status: "true",
                }, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

            }
            // Handle response as needed
            setLoading(false)
            Alert.alert(
                'Success',
                'Your item has been added to the wishlist!',
                [{ text: 'OK' }],
                { cancelable: false }
            );
        } catch (error) {
            console.error('There was a problem with the request:', error);
            setLoading(false);
            Alert.alert(
                'Error',
                'There was an issue with your request. Please try again.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }
    };


    const handleReservePress = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (!storedToken) { setIsModalVisible(true); }
            else if (storedToken) {
                const response = await instance.post('/event/booking', {
                    eventId: singleDataEvent?.id,
                    username: formData.fullName,
                    phoneNumber: formData.Number,
                    email: formData.email,
                    amount: 0,
                    vat: 0,
                    discount: 0,
                    price: 0,
                    person: count,
                    payStatus: "UNPAID",
                    eventDate: singleDataEvent?.startDate,
                    menuData: [{ data: "no content" }],
                    bookingStatus: "ON_HOLD",
                    issueAt: singleDataEvent?.startDate,
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
                                source={{ uri: image.link }}
                                style={{ width: width, height: 280, }}
                            />
                        ))}
                    </ScrollView>

                    <TouchableOpacity className="bg-white absolute mx-3 mt-4 h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }} onPress={() => navigation.goBack()} >
                        <Ionicons name="chevron-back-outline" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white absolute mr-3 mt-4 right-0 h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }} onPress={handleWishListPress}  >
                        <Ionicons name="bookmark-outline" size={20} />
                    </TouchableOpacity>



                    {/* <AllRestaurantsList /> */}
                </View>
                <View className="relative h-14 flex justify-center items-center">

                    <View className=" p-4 bg-white absolute  bottom-0 " style={{ width: width * 0.90, borderRadius: 12, elevation: 2 }}>
                        <View className="flex-row justify-between items-center" >
                            <Image

                                source={{ uri: singleData?.logo }}
                                style={{ width: 35, height: 35, borderRadius: 4 }} // Set your desired width and height
                            />
                            <View >
                                <Text className="font-Poppins-SemiBold text-left" style={{ fontSize: 14 }} >
                                    {singleData?.listingName}
                                </Text>
                                <Text className="font-Poppins-Bold text-left" style={{ color: "#B5B5B5", fontSize: 12 }}>
                                    {singleData?.title}
                                </Text>
                            </View>
                            <Text></Text>
                        </View>
                        <View className="flex-row pt-2 items-center  space-x-4 justify-center" >
                            <Text className="flex-row items-center" style={{ color: "#DC4A45", fontFamily: "Light" }}>
                                {/* <MapPinIcon color={"#DC4A45"} size={14} /> {data?.asset?.area} */}
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

                <ScrollView

                    contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <CategoryCard
                        onPress={() => handleCategoryPress('Reservation')}
                        title="Reservation"
                        isSelected={selectedCategory === 'Reservation'}
                    />
                    <CategoryCard
                        onPress={() => handleCategoryPress('Menu')}

                        title="Menu"
                        isSelected={selectedCategory === 'Menu'}
                    />
                    <CategoryCard
                        onPress={() => handleCategoryPress('Amenities')}

                        title="Amenities"
                        isSelected={selectedCategory === 'Amenities'}
                    />
                    <CategoryCard
                        onPress={() => handleCategoryPress('Overview')}

                        title="Overview"
                        isSelected={selectedCategory === 'Overview'}
                    />
                    {singleData?.eventStatus === true ?
                        <CategoryCard
                            onPress={() => handleCategoryPress('Event')}

                            title="Event"
                            isSelected={selectedCategory === 'Event'}
                        /> : <Text></Text>}

                </ScrollView>

                {selectedCategory && (
                    <View className="m-4" >
                        {selectedCategory === 'Reservation' && (

                            <View>
                                <CalenderComponents ReserveDate={setSelectDate} />
                                <Text className="font-Poppins-SemiBold pt-6" style={{ color: "#073064", fontSize: 16 }}>Available time</Text>
                                {timeslot.length > 0 ? (
                                    <ScrollView
                                        contentContainerStyle={{ paddingTop: 10 }}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {timeslot?.map((slot, index) => (
                                            <TouchableOpacity
                                                className="mr-2 flex-row items-center p-2 rounded-md space-x-2 "
                                                onPress={() => handleTimeSlotPress(slot, "Regular")}
                                                key={index}
                                                style={[
                                                    styles.timeSlot,
                                                    { backgroundColor: slot === selectedSlot ? '#073064' : 'white' },
                                                ]}
                                            >
                                                <Text className="font-Poppins-SemiBold" style={{ color: slot === selectedSlot ? 'white' : 'black', fontSize: 12 }}>{slot}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text className="pt-3 font-Poppins-Light text-center" >No slots available</Text>
                                )}
                                <View className="flex-row m-1 justify-between items-center">
                                    <View className="space-y-2 ">
                                        <Text className="font-Poppins-SemiBold pt-4" style={{ color: "#073064", fontSize: 16 }}>Guest</Text>
                                        <View className="bg-white flex-row items-center justify-between p-1 rounded-lg" style={{ width: 115 }}>
                                            <TouchableOpacity onPress={decrementCount}>
                                                <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, backgroundColor: "#FDE5E4", color: "#DC4A45" }}>-</Text>
                                                {/* <Image source={require('../assets/minas.png')} style={{ width: 30, height: 30 }} /> */}
                                            </TouchableOpacity>
                                            <Text className="font-Poppins-Medium text-md" >{count}</Text>
                                            <TouchableOpacity onPress={incrementCount}>
                                                <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, backgroundColor: "#DAE0E8", color: "#073064" }}>+</Text>
                                                {/* <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30 }} /> */}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View className="space-y-2 ">
                                        <Text className="font-Poppins-SemiBold pt-4 mb-2" style={{ color: "#073064", fontSize: 16 }}>Seating Type</Text>
                                        <CustomSelectList
                                            options={positions}
                                            selectedValue={selectedOption}
                                            onValueChange={setSelectedOption}
                                            placeholder="Select"
                                        />

                                    </View>
                                </View>

                                <TouchableOpacity className="mt-5" onPress={handleMoreTabPress} style={[styles.getStartedButton, { opacity: selectedSlot && timeslot.length > 0 ? 1 : 0.5 }]} disabled={timeslot.length === 0 && selectedSlot} >
                                    <Text className="font-Poppins-SemiBold text-center text-white"  >Reserve Now</Text>
                                </TouchableOpacity>



                            </View>


                        )}
                        {selectedCategory === 'Menu' && (

                            <MenuList menu={singleData?.food} />
                        )}
                        {selectedCategory === 'Amenities' && (
                            <Amenities data={singleData?.branches[0]?.amenities} />

                        )}
                        {selectedCategory === 'Overview' && (
                            <Overview data={overview} />

                        )}
                        {selectedCategory === 'Event' && (

                            switchtigger === true ? <View className="space-y-3">
                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Full Name</Text>
                                <View className="flex-row space-x-2 items-center px-2" style={styles.input}>
                                    <Ionicons name="person-outline" size={20} color="#041D3C" />
                                    <TextInput
                                        placeholder="Type your name"
                                        value={formData.fullName}
                                        onChangeText={(text) => handleChange('fullName', text)}
                                        className="flex-1 font-Poppins-Light"

                                    />
                                </View>
                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Email</Text>
                                <View className="flex-row space-x-2 items-center px-2" style={styles.input}>
                                    <Ionicons name="mail-outline" size={20} color="#041D3C" />
                                    <TextInput
                                        placeholder="Type your email"
                                        value={formData.email}
                                        onChangeText={(text) => handleChange('email', text)}
                                        className="flex-1 font-Poppins-Light"

                                    />
                                </View>
                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Phone Number</Text>
                                <View className="flex-row space-x-2 items-center px-2" style={styles.input}>
                                    <Ionicons name="call-outline" size={20} color="#041D3C" />
                                    <TextInput
                                        placeholder="Type your phone number"
                                        value={formData.Number}
                                        onChangeText={(text) => handleChange('Number', text)}
                                        className="flex-1 font-Poppins-Light "

                                    />
                                </View>
                                <View className="space-y-2 mb-3 ">
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
                                    className="bg-[#073064] w-full rounded-lg flex-row justify-center items-center"
                                    style={{ height: 50 }}
                                >
                                    <Text className="text-white text-center font-Poppins-SemiBold">
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            </View> : <View >
                                <View className="flex-row items-center space-x-1" >
                                    <Feather name="map-pin" size={14} color="#DC4A45" />
                                    <Text className="font-Poppins-Bold" style={{ color: "#DC4A45", fontSize: 12 }}>{singleDataEvent?.address}</Text></View>
                                <Text className="font-Poppins-SemiBold pt-4" style={{ color: "#073064", fontSize: 16 }}>Events Details</Text>
                                <Text className="font-Poppins-Light py-4" style={{ color: "#979797", fontSize: 14 }}>{singleDataEvent?.description}</Text>
                                <TouchableOpacity
                                    onPress={() => setSwithTigger(true)}
                                    className="bg-[#073064] w-full rounded-lg flex-row justify-center items-center"
                                    style={{ height: 50 }}
                                >
                                    <Text className="text-white text-center font-Poppins-SemiBold">
                                        Join Now
                                    </Text>
                                </TouchableOpacity>
                            </View>


                        )}
                        {/* Add more conditions for other categories as needed */}
                    </View>
                )}
            </ScrollView>
            <CustomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
        </SafeAreaView>


    )
}; const styles = StyleSheet.create({
    Buttons: {
        backgroundColor: '#073064',
        padding: 10,
        borderRadius: 8,
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    onboardingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 21,
        paddingTop: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#0E0E0E',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        color: '#B5B5B5',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    nextButton: {
        backgroundColor: '#073064',
        padding: 15,
        borderRadius: 8,
        flex: 1,
    },
    getStartedButton: {
        backgroundColor: '#073064',
        height: 50,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonTexts: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',

    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',

    },
    input: {
        borderColor: '#073064',
        borderWidth: 1.6,
        textAlign: 'center',
        borderRadius: 8,
        fontFamily: "Light"
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#073064',
    },
    modalButtonYes: {
        backgroundColor: 'green',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextYes: {
        color: '#fff',
    },
    listItem: {
        marginLeft: 10,
        marginBottom: 5,
        fontFamily: "Light",
        fontSize: 12
    },
    container: {
        flex: 1,
        elevation: 2
        // padding: 20,
        // justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        fontFamily: "Light",
        fontSize: 12,
        // textAlignVertical: "top"

    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    label: {
        marginLeft: 8,

    },
    deff: {
        fontFamily: "SemiBold",
        fontSize: 12,
        color: '#073064'
    },
    // getStartedButton: {
    //     backgroundColor: '#073064',
    //     padding: 15,
    //     borderRadius: 8,
    //     // flex: 1,
    // },
    // getStartedButton1: {
    //     // backgroundColor: '#ffff',
    //     padding: 15,
    //     borderRadius: 8,
    //     // flex: 1,
    //     borderWidth: 1,
    //     borderColor: '#073064',
    // },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: "SemiBold"
    },
    buttonText1: {
        color: '#073064',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: "SemiBold"
    },
});
const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is falsy

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

export default ViewRestaurant