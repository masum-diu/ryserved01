import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, Modal, ActivityIndicator, Linking, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { ChevronLeftIcon, } from 'react-native-heroicons/outline'
import { useRoute } from '@react-navigation/native'
// import { CheckCircleIcon, MapPinIcon, PhoneIcon, XCircleIcon } from 'react-native-heroicons/solid'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import instance from '../../api/api_instance'
const ModifyReservation = ({ navigation }) => {
    const [cancelConfirmLoading, setCancelConfirmLoading] = useState(false);
    const [checkedOption, setCheckedOption] = useState(null);
    const [data, setData] = useState(null);
    // console.log(data) 
    const [customReason, setCustomReason] = useState('');
    const [cancelMessage, setCancelMessage] = useState('');
    // console.log(cancelMessage)
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showGroupChecklistModal, setShowGroupChecklistModal] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [reservationCancelled, setReservationCancelled] = useState(false);
    const route = useRoute()
    const { id, resID, distance, status, date,
        time,
        guest, title } = route.params || {}

    // const { token } = useAuth()

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
    // const handleToggle = (option) => {
    //     if (checkedOption === option) {
    //         // If the clicked option is already checked, uncheck it
    //         setCheckedOption(null);
    //         setCancelMessage('');
    //     } else {
    //         // Otherwise, check the clicked option
    //         setCheckedOption(option);
    //         // Set the cancel message based on the selected option
    //         switch (option) {
    //             case 'option1':
    //                 setCancelMessage('Change of personal plans');
    //                 break;
    //             case 'option2':
    //                 setCancelMessage('I want to book another restaurant');
    //                 break;
    //             case 'option3':
    //                 setCancelMessage('Placed reservation by mistake');
    //                 break;
    //             case 'option4':
    //                 setCancelMessage('The restaurant asked me to cancel');
    //                 break;
    //             case 'option5':
    //                 setCancelMessage('Others');
    //                 break;
    //             default:
    //                 setCancelMessage('');
    //         }
    //     }
    // };
    const handleToggle = (option) => {
        if (checkedOption === option) {
            // If the clicked option is already checked, uncheck it
            setCheckedOption(null);
            setCancelMessage('');
            if (option === 'option5') {
                // Reset custom reason when deselecting "Others"
                setCustomReason('');
            }
        } else {
            // Otherwise, check the clicked option
            setCheckedOption(option);
            // Set the cancel message based on the selected option
            switch (option) {
                case 'option1':
                    setCancelMessage('Change of personal plans');
                    break;
                case 'option2':
                    setCancelMessage('I want to book another restaurant');
                    break;
                case 'option3':
                    setCancelMessage('Placed reservation by mistake');
                    break;
                case 'option4':
                    setCancelMessage('The restaurant asked me to cancel');
                    break;
                case 'option5':
                    setCancelMessage('Others');
                    break;
                default:
                    setCancelMessage('');
            }
        }
    };

    const handlePress = () => {
        status === "ON_HOLD" ?  
            navigation.navigate('ReservationEdit', {
                id, resID, distance
            }) : "";
    };
    const handleCancelReservation = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancellation = () => {
        // Make API call to cancel reservation
        // Assuming the API call is successful
        setReservationCancelled(true);
        setShowCancelModal(false);
        setShowGroupChecklistModal(true);
    };

    const handleConfirmChecklist = () => {
        // Make API call to confirm checklist
        // Assuming the API call is successful
        setShowGroupChecklistModal(false);
    };
    const handlePhoneDialer = () => {
        const phoneNumber = '01316993049'; // Replace this with the phone number you want to dial
        Linking.openURL(`tel:${phoneNumber}`);
    };
    const handleLocationClick = () => {
        const location = data?.branches[0]?.location;
        Linking.openURL(location);
    };
    const { width, height } = Dimensions.get('window');
    const handleUpdateReservePress = async () => {
        // if (timeslot.length === 0 || !selectedSlot) {
        //   return; // Do nothing if the button is disabled
        // }
        if (cancelConfirmLoading) {
            return; // Prevent multiple clicks while API request is in progress
        }
        try {

            setCancelConfirmLoading(true);
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {

                const response = await instance.put(`/booking/${id}`, {

                    cancelReason: checkedOption === 'option5' ? customReason : cancelMessage,
                    status: "CANCELED"

                }, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                
                if (response?.data) {
                    //   setUserDataUpdate1(response?.data)
                    // showToast('Your Reservation is Updated');
                    const updateStats = response?.data?.status
                    navigation.navigate('CancelReservation', { resID, updateStats, time, date, guest, title, distance, id, });
                    setShowGroupChecklistModal(false);
                    setCancelMessage('');
                }
            }
            // Handle response as needed
            setCancelConfirmLoading(false);
        } catch (error) {
            console.error('There was a problem with the request:', error);
            setCancelConfirmLoading(false);
        }
    };
    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: "#E6EAF0" }}>
            <ScrollView>
                <View className="p-4">
                    <TouchableOpacity className="bg-white  h-8 w-8 flex-row items-center justify-center rounded-md" style={{borderColor: '#DBDBDB', borderWidth: 1}} onPress={() => navigation.goBack()} >
                        <Ionicons name="chevron-back-outline" size={20} />
                    </TouchableOpacity>
                    <View className=" p-6 bg-white bottom-0 mt-4" style={{ width: width * 0.92, borderRadius: 12, elevation: 2 }}>

                        <Text className="font-Poppins-SemiBold text-lg text-center" >
                            {title}
                        </Text>

                        {
                            status === "ON_HOLD" ?
                                <View className="flex-row items-center justify-center space-x-1">
                                    {/* <CheckCircleIcon color={"orange"} size={14} /> */}
                                    <Text className="font-Poppins-Light" style={{ fontSize: 12, color: "orange" }}>Reservation On Hold </Text>
                                </View>
                                : status === "CONFIRMED" ?
                                    <View className="flex-row items-center justify-center space-x-1">
                                        {/* <CheckCircleIcon color={"green"} size={14} /> */}
                                        <Text  className="font-Poppins-Light" style={{ fontSize: 12,  color: "green" }}>Reservation <Text className="lowercase">{status}</Text> </Text>
                                    </View>
                                    :
                                    <View className="flex-row items-center justify-center space-x-1">
                                        {/* <XCircleIcon color={"red"} size={14} /> */}
                                        <Text  className="font-Poppins-Light" style={{ fontSize: 12,  color: "red" }}>Reservation <Text className="lowercase">{status}</Text> </Text>
                                    </View>

                        }




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
                    <View className="flex-row space-x-3">

                        <View className=" p-6 bg-white   bottom-0 mt-4" style={{ width: width * .45, borderRadius: 12, elevation: 2 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Explore' })}>
                                <View className="flex-col items-center space-y-2">
                                    <Image source={require('../../../assets/image/Group2437.png')} style={{ width: 30, height: 30 }} />
                                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Explore</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className=" p-6 bg-white bottom-0 mt-4" style={{ width: width * .44, borderRadius: 12, elevation: 2 }}>
                            <TouchableOpacity onPress={handlePhoneDialer} >
                                <View className="flex-col items-center space-y-2">
                                    <Image source={require('../../../assets/image/dailer.png')} style={{ width: 30, height: 30 }} />
                                    <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Get Dialer</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className=" p-6 bg-white bottom-0 mt-4" style={{ width: width * .92, borderRadius: 12, elevation: 2 }}>
                    <TouchableOpacity onPress={handleLocationClick} >
                        <View className="flex-col items-center space-y-2">
                            <Image source={require('../../../assets/image/Group243.png')} style={{ width: 30, height: 30 }} />
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>Get directions</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                    {isLoading ? <View style={{ paddingVertical: 20 }}>
                        <Text className="text-center">Loading...</Text>
                    </View> : <View className="pt-5 space-y-3">

                        <Text className="font-Poppins-SemiBold text-left" style={{ fontSize: 22 }}>
                            {data?.listingName}
                        </Text>
                        <Text  className="text-sm text-left font-Poppins-Light" style={{ color: "#B5B5B5", }}>
                            {data?.title}
                        </Text>

                        <View className="flex-row  space-x-1">
                            {/* <MapPinIcon color={"#DA4A54"} size={12} /> */}
                            <Text className="font-Poppins-Light" style={{ color: "#DA4A54", fontSize: 12 }}>{data?.branches[0]?.address}</Text>

                        </View>

                        {/* <View className="flex-row items-center space-x-2">
                            <PhoneIcon color={"#073064"} size={12} />
                            <Text style={{ color: "#073064", fontFamily: "Medium", fontSize: 12 }}>{data?.asset?.business?.businessManager }</Text>
                        </View> */}
                        <Text className="text-lg font-Poppins-SemiBold" style={{ color: "#073064", fontSize: 16 }}>Photos</Text>
                        <View >
                            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "start", }}>
                                {data?.branches[0]?.images.map((image, index) => (

                                    <Image key={index} source={{ uri: image.link }} style={{ width: 100, height: 100, margin: 5, borderRadius: 4 }} />

                                ))}
                            </ScrollView>

                            {/* Modal to display full-screen image */}


                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity className="mt-4 mb-3" onPress={handlePress} style={{ opacity: status === "ON_HOLD" ? 1 : 0.5, backgroundColor: '#073064', padding: 10, width: width * .45, borderRadius: 8 }} disabled={status !== "ON_HOLD"} >
                                <Text className="font-Poppins-Medium" style={{ fontSize: 12, textAlign: "center", color: "#ffff", }}>Modify Reservation </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="mt-4 mb-3 " onPress={() => setShowCancelModal(true)} style={{
                                opacity: status === "ON_HOLD" ? 1 : 0.5, padding: 10, width: width * .44, borderRadius: 8, borderWidth: 1,
                                borderColor: '#073064',
                            }} disabled={status !== "ON_HOLD"} >
                                <Text className="font-Poppins-Medium" style={{ fontSize: 12, textAlign: "center", color: "#073064", }}>Cancel Reservation </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }

                    <Modal
                        visible={showCancelModal}
                        transparent={true}
                        onRequestClose={() => setShowCancelModal(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text className="font-Poppins-SemiBold" style={{ textAlign: "center", color: "#073064", fontSize: 22 }}>Cancel Reservation</Text>
                                <Text className="font-Poppins-Light" style={{ textAlign: "center", color: "#979797", fontSize: 14 }}>Are you sure you want to cancel this reservation?</Text>
                                <View className="flex-row space-x-5 pt-4">
                                    <TouchableOpacity style={{
                                        borderWidth: 1, width: 60, height: 40,
                                        borderColor: '#073064', borderRadius: 6, display: "flex", justifyContent: "center", alignItems: "center"
                                    }} onPress={() => setShowCancelModal(false)}>
                                        <Text className="font-Poppins-SemiBold" style={{ textAlign: "center", color: "#073064" }} >No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        borderWidth: 1, width: 60, height: 40,
                                        borderColor: '#073064', borderRadius: 6, display: "flex", justifyContent: "center", alignItems: "center"
                                    }} onPress={handleConfirmCancellation}>
                                        <Text className="font-Poppins-SemiBold"  style={{ textAlign: "center", color: "#073064" }}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        visible={showGroupChecklistModal}
                        transparent={true}
                        onRequestClose={() => setShowGroupChecklistModal(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text className="font-Poppins-SemiBold"  style={{ textAlign: "center", color: "#073064", fontSize: 18 }}>Why Cancel Your Reservation?</Text>
                                <View className="pt-4">
                                    <TouchableOpacity className="space-x-5" style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => handleToggle('option1')}>
                                        <FontAwesome5 name={checkedOption === 'option1' ? 'check-square' : 'square'} size={24} color="#0E0E0E" />
                                        <Text className="font-Poppins-Light"  >Change of personal plans</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="space-x-5 mt-3" style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleToggle('option2')}>
                                        <FontAwesome5 name={checkedOption === 'option2' ? 'check-square' : 'square'} size={24} color="#0E0E0E" />
                                        <Text className="font-Poppins-Light" >I want to book another restaurant</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="space-x-5 mt-3" style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleToggle('option3')}>
                                        <FontAwesome5 name={checkedOption === 'option3' ? 'check-square' : 'square'} size={24} color="#0E0E0E" />
                                        <Text className="font-Poppins-Light">Placed reservation by mistake</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="space-x-5 mt-3" style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleToggle('option4')}>
                                        <FontAwesome5 name={checkedOption === 'option4' ? 'check-square' : 'square'} size={24} color="#0E0E0E" />
                                        <Text className="font-Poppins-Light" >The restaurant asked me to cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="space-x-5 mt-3" style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleToggle('option5')}>
                                        <FontAwesome5 name={checkedOption === 'option5' ? 'check-square' : 'square'} size={24} color="#0E0E0E" />
                                        <Text className="font-Poppins-Light" >Others</Text>
                                    </TouchableOpacity>
                                    {checkedOption === 'option5' && (
                                        <TextInput
                                            className="mt-2 font-Poppins-Light"
                                            style={styles.textInput}
                                            placeholder="Enter your reason"
                                            value={customReason}
                                            onChangeText={setCustomReason}
                                        />
                                    )}

                                </View>
                                {cancelConfirmLoading ? <ActivityIndicator className="mt-2" size={24} color="#073064" /> :
                                    <TouchableOpacity disabled={!checkedOption || cancelConfirmLoading} className="space-x-5 mt-4" style={[styles.modalButton, { opacity: checkedOption ? 1 : 0.5 }]} onPress={handleUpdateReservePress}>
                                        <Text className="font-Poppins-SemiBold" style={styles.buttonText}>Cancel Confirm </Text>
                                    </TouchableOpacity>}

                            </View>
                        </View>
                    </Modal>
                    {/* <TouchableOpacity className="mt-4 mb-3" style={[styles.getStartedButton, { opacity: checked ? 1 : 0.5 }]} onPress={handleReservePress} disabled={!checked}>
                <Text style={styles.buttonText}>Reserve Confirm</Text>
            </TouchableOpacity> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
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
        // fontWeight: 'bold',
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
        // fontWeight: 'bold',
    },
    buttonTextYes: {
        color: '#fff',
    },
    listItem: {
        marginLeft: 10,
        marginBottom: 5,
        // fontFamily: "Light",
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
        // fontFamily: "Light",
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
        // fontFamily: "SemiBold"
    },
    buttonText1: {
        color: '#073064',
        fontSize: 16,
        textAlign: 'center',
        // fontFamily: "SemiBold"
    },
});
export default ModifyReservation