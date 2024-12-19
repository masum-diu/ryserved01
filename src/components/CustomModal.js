import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert, Linking, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../api/api_instance';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
const DEFAULT_COUNTRY_CODE = '+880'; // Default country code
import DateTimePicker from '@react-native-community/datetimepicker';
const CustomModal = ({ navigation, visible, onClose,onReset  }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [ConfirmLoading, setConfirmLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const { width, height } = Dimensions.get('window');
    const [currentStep, setCurrentStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [timer, setTimer] = useState(150);
    const [showDate, setShowDate] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: new Date(),
    });
    const [date, setDate] = useState(new Date());
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios"); // Keep the picker open on iOS
        setDate(currentDate); // Update the date state
    };

    const showDatepicker = () => {
        setShow(true);
    };
    useLayoutEffect(() => {
        if (navigation) {
            navigation.setOptions({
                headerShown: false,
            });
        }
    }, [navigation]);

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const savedCountryCode = await AsyncStorage.getItem('countryCode');
                if (savedCountryCode) {
                    setCountryCode(savedCountryCode);
                } else {
                    setCountryCode(DEFAULT_COUNTRY_CODE);  // Fallback default country code
                }
            } catch (error) {
                console.error('Error fetching country code from AsyncStorage:', error);
            }
        };
        fetchCountryCode();
    }, []);

    const handleCountryCodeChange = async (item) => {
        try {
            await AsyncStorage.setItem('countryCode', item.dial_code);
            setCountryCode(item.dial_code);
            setShow(false);
        } catch (error) {
            console.error('Error saving country code:', error);
        }
    };

    const inputRefs = Array.from({ length: 4 }, () => useRef(null));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleDigitChange = (index, text) => {
        const newDigit = text.replace(/[^0-9]/g, '').substring(0, 1);
        setVerificationCode((prevCode) => {
            const newCode = newDigit ? prevCode + newDigit : prevCode.slice(0, -1);
            if (newDigit && index < 3) {
                inputRefs[index + 1].current.focus();
            }
            if (!newDigit && index > 0) {
                inputRefs[index - 1].current.focus();
            }
            return newCode;
        });
    };
    const onDateChange = (event, selectedDate) => {
        console.log(userData?.birthDate)
        const currentDate = selectedDate || userData?.birthDate;
        setShowDate(false);
        setUserData({ ...userData, birthDate: currentDate });
    };

    const showDatePicker = () => {
        setShowDate(true);
    };
    const handleContinuePress = async () => {
        if (currentStep === 1) {
            try {
                setConfirmLoading(true);
                const response = await instance.post('/auth/otp/request', {
                    phoneNumber: phoneNumber,
                    platform: 'apps',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response && response.data) {
                    console.log(response?.data?.otp);
                    setCurrentStep(2);
                } else {
                    Alert.alert('Error', 'Unexpected response from the server.');
                }
            } catch (error) {
                console.error('Error during OTP request:', error);
                Alert.alert(
                    'Error',
                    'There was a problem with the request. Please try again later.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            } finally {
                setConfirmLoading(false);
            }
        } else if (currentStep === 2) {

            try {
                setConfirmLoading(true);
                const response = await instance.post('/auth/otp/verify', {
                    phoneNumber: phoneNumber,
                    otp: verificationCode,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // console.log(response?.data)
                if (response && response?.data) {
                    if (response?.data?.isVerify === false) {
                        setCurrentStep(3);
                        // const saveData = async (key, value) => {
                        //     try {
                        //         await AsyncStorage.setItem(key, value);
                        //         console.log('Token saved successfully');
                        //     } catch (error) {
                        //         console.error('Error saving data:', error);
                        //     }
                        // };
                        // if (response?.data?.token) {
                        //     saveData('token', response?.data?.token);
                        //     // navigation.navigate('AccountLoginMessage');

                        //     //  setCurrentStep(5);
                        //     // if (segmentClient && segmentClient.track) {
                        //     //     segmentClient.track('Login status', { param2: 'value3' });
                        //     // } else {
                        //     //     console.error('Segment client or track method is not available');
                        //     // }

                        // }
                    } else if (response.data?.user?.isVerify === true) {
                        const saveData = async (key, value) => {
                            try {
                                await AsyncStorage.setItem(key, value);
                                console.log('Token saved successfully');
                            } catch (error) {
                                console.error('Error saving data:', error);
                            }
                        };
                        if (response?.data) {
                            saveData('token', response?.data?.token);
                            // console.log(response.data)
                            // navigation.navigate('AccountCreated');
                            setCurrentStep(5)
                        }

                        //  setCurrentStep(5);
                        // const NumberItem = response.data.user?.user?.phoneNumber;
                        // navigation.navigate('Account', { NumberItem });
                    }
                } else {
                    Alert.alert('Error', 'Unexpected response from the server.');
                }
            } catch (error) {
                console.error('Error during verification:', error);
                Alert.alert(
                    'Error',
                    'Your verification code is not valid.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            } finally {
                setConfirmLoading(false);
            }
        } else if (currentStep === 3) {
            try {
                setConfirmLoading(true)
                const response = await instance.post('/auth/information', {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    birthDate: userData.birthDate,
                    phoneNumber: phoneNumber,
                    platform: 'apps',
                    isOtpVerify: false,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const saveData = async (key, value) => {
                    try {
                        await AsyncStorage.setItem(key, value);
                        console.log('Token saved successfully');
                    } catch (error) {
                        console.error('Error saving data:', error);
                    }
                };
                if (response?.data) {
                    saveData('token', response?.data?.token);
                    // console.log(response.data)
                    // navigation.navigate('AccountCreated');
                    setCurrentStep(4)
                }
                // Handle response as needed
                setConfirmLoading(false)
            } catch (error) {
                console.error('There was a problem with the request:', error);
            }
        }

    };

    const handlePhoneNumberChange = (text) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        const formattedText = cleanedText.substring(0, 11);  // Limit input to 11 digits
        setPhoneNumber(formattedText);
    };

    const gustUser = async () => {
        try {
            setConfirmLoading(true);
            const response = await instance.post('/auth/login?for=guest', {
                phoneNumber: "01277744111",
                platform: 'apps',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data) {
                const saveData = async (key, value) => {
                    try {
                        await AsyncStorage.setItem(key, value);
                        // console.log('Token saved successfully');
                        // console.log(response.data)
                        setCurrentStep(5)
                    } catch (error) {
                        console.error('Error saving data:', error);
                    }
                };
                saveData('token', response.data.token);
                // navigation.navigate('AccountLoginMessage');
            }
        } catch (error) {
            console.error('Error during guest login:', error);
            Alert.alert(
                'Error',
                'There was a problem with the request. Please try again later.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
        } finally {
            setConfirmLoading(false);
        }
    };

    const openURLWithCheck = async (url) => {
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open URL. Please check your internet connection or try again later.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open URL. Please try again later.');
        }
    };
    const formatDate = (date) => {

        if (!date) return ""; // Guard against invalid dates
        console.log(date, "infinty find2")
        const formattedDate = new Date(date);
        const day = formattedDate.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
        const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
        const year = formattedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const isFormFilled = () => {
        return (
            userData.firstName !== '' &&
            userData.lastName !== '' &&
            userData.email !== ''
        );
    };

    const handleContinue = () => openURLWithCheck('https://ryserved.com/privacy-policy/');
    const handleClose = () => {
        if (onReset) {
            onReset(); // Call the reset function passed as a prop
        }
        onClose(); // Close the modal
    };
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={handleClose}
        >
            <SafeAreaView className="bg-white h-full">
                <ScrollView>
                    {currentStep === 1 && (
                        <View className="p-4 ">
                            <TouchableOpacity style={{ width: width * .90 }} className="mb-2 flex-row justify-end items-end" onPress={onClose}>
                                <Ionicons name="close-circle-outline" size={30} color="gray" />
                            </TouchableOpacity>
                            <View className="flex-col items-center space-y-10">
                                <Image source={require('../../assets/image/logo.png')} style={{ width: 190, height: 27 }} />
                                <Image source={require('../../assets/image/logoicons.png')} style={{ width: 70, height: 82 }} />
                                <Text className="text-3xl font-Poppins-Bold" style={{ fontSize: 28 }}>Login</Text>
                                <View className="flex-row space-x-2 items-center w-full border rounded-lg  px-2" >
                                    <Image source={require('../../assets/image/bangladeshlogo.png')} style={{ width: 20, height: 20 }} />
                                    <Text className="font-Poppins-Light">+88</Text>
                                    <TextInput
                                        className="flex-1 font-Poppins-Light"
                                        placeholder="01XXXXXXXXX"
                                        keyboardType="number-pad"
                                        onChangeText={handlePhoneNumberChange}
                                        value={phoneNumber}
                                    />
                                    {/* <CountryPicker show={show} pickerButtonOnPress={handleCountryCodeChange} /> */}
                                </View>
                            </View>
                            <Text className="text-sm pt-4 mx-2 mb-3 font-Poppins-Light" style={{ color: "#B5B5B5", fontSize: 12 }}>
                                We will send you the 4-digit verification code only applicable for Bangladesh
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                {ConfirmLoading ? (
                                    <View className="w-full flex-row justify-center">
                                        <ActivityIndicator size="large" color="#073064" />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleContinuePress} className="bg-[#073064] w-full p-3 rounded-lg">
                                        <Text className="text-white text-center font-Poppins-SemiBold" >Continue</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity className="mt-5" onPress={gustUser} style={{}}>
                                <Text className="underline capitalize text-left font-Poppins-Light" style={{ color: "#B5B5B5" }}>Or Login as a Guest User</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="mt-2" onPress={handleContinue} style={{}}>
                                <Text className="underline capitalize text-left font-Poppins-Light" style={{ color: "#B5B5B5" }}>By Signing up, you agree to our Privacy Policy.</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {currentStep === 2 && (
                        <View className="p-4 mt-12">
                            <View className="flex-col items-center space-y-8">
                                <Image source={require('../../assets/image/logo.png')} style={{ width: 190, height: 27 }} />
                                <Image source={require('../../assets/image/verifi.png')} style={{ width: 70, height: 86 }} />
                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 28 }}>Verification</Text>
                                <Text className="text-center font-Poppins-Light" style={{ color: "#B5B5B5", fontSize: 14 }}>Enter the 4-digit verification code sent to {phoneNumber}</Text>
                                <View className="flex-row justify-between items-center" style={styles.input1}>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <TextInput
                                            // className="font-Poppins-SemiBold"
                                            key={index}
                                            ref={inputRefs[index]}
                                            onChangeText={(text) => handleDigitChange(index, text)}
                                            value={verificationCode[index] || ''}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={styles.digitInput}
                                        />
                                    ))}
                                </View>
                                <Text className="text-sm  text-center font-Poppins-Light " style={{ color: "#B5B5B5" }}>This code will be expired in <Text className="font-bold" style={{ color: "#073064" }}>{Math.floor(timer / 60)}:{timer % 60}</Text>  </Text>
                                {/* {timer === 0 && <TouchableOpacity >
                                    <Text style={{ color: '#073064' }}>Resend verification code</Text>
                                </TouchableOpacity>

                                } */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {ConfirmLoading ? (
                                        <View className="w-full flex-row justify-center">
                                            <ActivityIndicator size="large" color="#073064" />
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={handleContinuePress} className="bg-[#073064] w-full rounded-xl flex-row justify-center items-center" style={{ height: 50 }}  >
                                            <Text className="text-white text-center font-Poppins-SemiBold" >Continue</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                    {currentStep === 3 && <View className="p-4 mt-12 space-y-3 ">
                        <View className="flex-col items-center space-y-5 ">
                            <Image source={require('../../assets/image/logo.png')} style={{ width: 86, height: 12 }} />
                            <Image source={require('../../assets/image/carateicons.png')} style={{ width: 70, height: 86 }} />
                            <View className="flex-col items-center space-y-3 ">
                                <Text className="text-3xl font-Poppins-SemiBold " >Create Account</Text>

                                <View className="flex-col items-center space-y-1 ">
                                    <Text className="text-sm font-Poppins-Light" style={{ color: "#B5B5B5", }}>Create an acceptable account
                                    </Text>
                                    <Text className="text-sm font-Poppins-Light" style={{ color: "#B5B5B5", }}> with your information
                                    </Text>
                                </View>



                            </View>
                            <View className="flex-row items-center space-y-2 " style={{ flexDirection: "column" }}>
                                <View className="flex-row space-x-2  items-center  py-0 " style={styles.input} >

                                    <Feather name="user" color={"gray"} size={20} />
                                    <TextInput
                                        placeholder="First Name"
                                        className="flex-1 font-Poppins-Light"
                                        keyboardType="default"

                                        value={userData.firstName}
                                        onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                                    />
                                </View>
                                <View className="flex-row space-x-2 items-center   py-0 " style={styles.input} >
                                    <Feather name="user" color={"gray"} size={20} />
                                    <TextInput
                                        placeholder="Last Name"
                                        className="flex-1 font-Poppins-Light"
                                        keyboardType="default"

                                        value={userData.lastName}
                                        onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                                    />
                                </View>

                                <View className="flex-row space-x-2  items-center py-0" style={styles.input} >
                                    <Ionicons name="mail-outline" size={20} color="gray" />
                                    <TextInput
                                        placeholder="Email Address"
                                        className="flex-1 font-Poppins-Light"
                                        keyboardType="email-address"


                                        value={userData.email}
                                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                                    />
                                </View>

                                <View className="flex-row space-x-2 items-center " style={styles.input}>

                                    <TouchableOpacity className="w-full flex-row py-0  " onPress={showDatePicker}>
                                        <Ionicons name="calendar-outline" size={20} color="gray" />
                                        {showDate && (
                                            <DateTimePicker
                                                value={userData?.birthDate}
                                                className="font-Poppins-Light"
                                                mode="date"
                                                display="default"
                                                onChange={onDateChange}

                                            />
                                        )}
                                        <Text className=" px-1 font-Poppins-Light" > {formatDate(userData.birthDate)}</Text>
                                    </TouchableOpacity>

                                    {/* <TextInput
                                placeholder="05-11-1994"
                                className="flex-1"
                                keyboardType="default"
                            // onChangeText={handlePhoneNumberChange}
                            /> */}

                                </View>

                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            //  height: height * 0.28
                        }} >
                            {ConfirmLoading ? <View className="w-full flex-row justify-center" ><Text ><ActivityIndicator className="mt-2" size={24} color="#073064" /> </Text></View> : <TouchableOpacity disabled={!isFormFilled()} style={[styles.Buttons, { opacity: isFormFilled() ? 1 : 0.5 }]} onPress={handleContinuePress}  >
                                <Text className="font-Poppins-Bold" style={styles.buttonTexts} >Save</Text>
                            </TouchableOpacity>}

                        </View>
                    </View>}
                    {currentStep === 4 && <View className="p-4 mt-12 space-y-7">
                        <View className="flex-col items-center space-y-9 ">
                            <Image source={require('../../assets/image/logo.png')} style={{ width: 190, height: 27 }} />
                            <Image source={require('../../assets/image/sucessaccount.png')} style={{ width: 70, height: 86 }} />
                            <View className="flex-col items-center space-y-3 ">
                                <Text className="text-3xl font-Poppins-SemiBold" >Account Has</Text>
                                <Text className="text-3xl font-Poppins-SemiBold" >Been Created!</Text>

                                <View className="flex-col items-center space-y-1 text-center justify-center ">
                                    <Text className="text-sm text-center font-Poppins-Light " style={{ color: "#B5B5B5", }}>
                                        Ryserved account has been successfully
                                    </Text>
                                    <Text className="text-sm text-center font-Poppins-Light " style={{ color: "#B5B5B5", }}>
                                        created! This means that you now have access
                                    </Text>
                                    <Text className="text-sm text-center font-Poppins-Light " style={{ color: "#B5B5B5", }}>
                                        to secure and private browsing, Now that you
                                    </Text>
                                    <Text className="text-sm text-center font-Poppins-Light " style={{ color: "#B5B5B5", }}>
                                        are allowed to use the app, hope you enjoy
                                    </Text>
                                    <Text className="text-sm text-center font-Poppins-Light" style={{ color: "#B5B5B5", }}>
                                        using the app.
                                    </Text>

                                </View>


                            </View>

                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            //  height: height * 0.70
                        }} >
                            <TouchableOpacity style={styles.Buttons} onPress={onClose} >
                                <Text className="font-Poppins-Bold" style={styles.buttonTexts} >Take Me to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                    {currentStep === 5 &&

                        <View className="p-4 mt-12 space-y-7 flex-col justify-center items-center" style={{ height: height * .80 }}>
                            <View className="flex-col items-center space-y-9 " >
                                {/* <Image source={require('../assets/login_image/logo.png')} style={{ width: 190, height: 27 }} />
                    <Image source={require('../assets/login_image/complate.png')} style={{ width: 70, height: 86 }} /> */}
                                <View className="flex-col items-center space-y-3 ">

                                    <Ionicons name="checkmark-circle" color={"#17C964"} size={90} />
                                    <Text className="text-3xl font-Poppins-SemiBold">Login Successful</Text>

                                    {/* <View className="flex-col items-center space-y-1 text-center justify-center ">
                            <Text className="text-sm text-center " style={{ color: "#B5B5B5",fontFamily:"Light" }}>
                                Ryserved account has been successfully
                            </Text>
                            <Text className="text-sm text-center " style={{ color: "#B5B5B5",fontFamily:"Light" }}>
                                created! This means that you now have access
                            </Text>
                            <Text className="text-sm text-center  " style={{ color: "#B5B5B5",fontFamily:"Light" }}>
                                to secure and private browsing, Now that you                          
                                 </Text>
                            <Text className="text-sm text-center  " style={{ color: "#B5B5B5",fontFamily:"Light" }}>
                                are allowed to use the app, hope you enjoy                            
                                </Text>
                            <Text className="text-sm text-center " style={{ color: "#B5B5B5",fontFamily:"Light" }}>
                                using the app.
                            </Text>

                        </View> */}


                                </View>

                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                //  height: height * 0.70
                            }} >
                                <TouchableOpacity style={styles.Buttons} onPress={onClose}  >
                                    <Text className="font-Poppins-Bold" style={styles.buttonTexts} >Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    input: {

        borderColor: '#073064',
        borderWidth: 1.6,

        textAlign: 'center',
        borderRadius: 8,

    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
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

export default CustomModal;
