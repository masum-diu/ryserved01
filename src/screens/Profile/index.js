import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, Dimensions, ScrollView, ActivityIndicator, Modal, TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import instance from '../../api/api_instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../components/CustomModal';
import { useIsFocused } from '@react-navigation/native';

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [id, setID] = useState('');
    const [toggler, setToggler] = useState(true)
    const [togglerUser, setTogglerUser] = useState(true)

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { width } = Dimensions.get('window');
    // const containerWidth = width > 360 ? 332 : width * 0.9;
    const isFocused = useIsFocused();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        residenceAddress: '',
    });

    const handleChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                const response = await instance.get('/me', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data) {
                    // console.log(response?.data)
                    setUser(response?.data);
                    setID(response?.data?.id)

                    setFormData({
                        firstName: response?.data.firstName || '',
                        lastName: response?.data.lastName || '',
                        email: response?.data.email || '',
                        birthDate: response?.data.birthDate || '',
                        residenceAddress: response?.data.residenceAddress || '',
                    });
                }
            } else {
                setUser(null); // Reset user state if no token is found
            }
            setLoading(false);
        } catch (error) {
            // console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                const response = await instance.put(`/user/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data) {
                    // Optionally, update the user state to reflect the new data
                    setUser(response?.data);
                    setTogglerUser(true); // Switch back to view mode after submission
                    alert("Profile updated successfully!");
                }
            } else {
                alert("No token found. Please login again.");
            }
        } catch (error) {
            // console.error(error);
            alert("Error updating profile.");
        }
    };


    const handleLogout = async () => {
        setModalVisible(false);
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (!storedToken) {
                console.error('No token found. Cannot proceed with logout.');
                return;
            }

            const response = await instance.put(
                '/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Logout Response:', response.data);
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isFocused]);

    const sections = [
        {
            title: 'My Account',
            items: [
                { name: 'Personal information', icon: <Feather name="user" color="#DC4A45" size={24} />, action: () => setToggler((prev) => !prev), },
                { name: 'Language', icon: <Ionicons name="language-outline" color="#DC4A45" size={24} />, extra: 'English (US)' },
                { name: 'Privacy Policy', icon: <Feather name="lock" color="#DC4A45" size={24} /> },
                { name: 'Settings', icon: <Feather name="settings" color="#DC4A45" size={24} /> },
            ],
        },
        {
            title: 'More',
            items: [
                { name: 'Events', icon: <Ionicons name="calendar-outline" color="#DC4A45" size={24} /> },
                { name: 'Discounts', icon: <Ionicons name="pricetags-outline" color="#DC4A45" size={24} /> },
                { name: 'Offers', icon: <Ionicons name="gift-outline" color="#DC4A45" size={24} /> },
                { name: 'About Ryserved', icon: <Ionicons name="information-circle-outline" color="#DC4A45" size={24} /> },
                { name: 'Terms and conditions', icon: <Ionicons name="document-text-outline" color="#DC4A45" size={24} /> },
                {
                    name: 'Logout',
                    icon: <Ionicons name="log-out-outline" color="#DC4A45" size={24} />,
                    action: () => setModalVisible(true),
                },
            ],
        },
    ];

    if (loading) {
        return (
            <View className="h-full flex-row justify-center items-center">
                <ActivityIndicator size="large" color="#073064" />
            </View>
        );
    }

    return (
        <>

            {user ? (
                <ScrollView className="p-4" style={{ backgroundColor: '#E6EAF0' }}>
                    {/* Profile Header */}
                    <View>
                        {togglerUser ? <View className="flex-col justify-center items-center space-y-2 mb-4">
                            <Image
                                source={require('../../../assets/image/12594.png')}
                                style={{ width: 90, height: 90 }}
                            />
                            <Text className="font-Poppins-Bold" style={{ fontSize: 16 }}>
                                {user?.name}
                            </Text>
                        </View> : <Text className="font-Poppins-SemiBold mb-2" style={{ fontSize: 16, textAlign: "center", }}>Edit Profile</Text>}

                        {/* Render Sections */}
                        {<View
                            className="p-4 space-y-4"
                            style={{
                                backgroundColor: '#ffff',
                                borderRadius: 12,
                                // width: containerWidth,

                            }}
                        >

                            {toggler ? sections.map((section, sectionIndex) => (
                                <View key={sectionIndex} className="space-y-3">
                                    <Text
                                        className="font-Poppins-SemiBold"
                                        style={{ fontSize: 16, color: '#073064' }}
                                    >
                                        {section.title}
                                    </Text>
                                    {section.items.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="flex-row space-x-2 justify-between items-center"
                                            onPress={item.action}
                                        >
                                            <View className="flex-row space-x-2 items-center">
                                                {item.icon}
                                                <Text className="font-Poppins-Medium" style={{ fontSize: 16 }}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            {item.extra && (
                                                <Text className="font-Poppins-Regular" style={{ fontSize: 14 }}>
                                                    {item.extra}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )) :

                                <View
                                > {
                                        togglerUser ? <View className="space-y-4 ">
                                            <View className="flex-row justify-between items-center">
                                                <TouchableOpacity
                                                    className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }}
                                                    onPress={() => setToggler((prev) => !prev)}
                                                >
                                                    <Ionicons name="chevron-back-outline" color="#073064" size={18} />
                                                </TouchableOpacity>
                                                <TouchableOpacity className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }} onPress={() => setTogglerUser((prev) => !prev)}>
                                                    <Feather name="edit" color="#073064" size={15} />
                                                </TouchableOpacity>

                                            </View>

                                            <View >

                                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14, color: "#073064" }}>Number</Text>



                                                <View className="flex-row items-center space-x-3">
                                                    <Image source={require('../../../assets/image/phoneflip.png')}
                                                        style={{ width: 20, height: 20 }} />

                                                    <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: "#073064" }}>{user?.phoneNumber}</Text>
                                                </View>

                                            </View>
                                            <View>
                                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14, color: "#073064" }}>Email</Text>
                                                <View className="flex-row items-center space-x-3">
                                                    <Image source={require("../../../assets/image/envelope.png")} style={{ width: 20, height: 20 }} />

                                                    <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: "#073064" }}>{user?.email}</Text>
                                                </View>

                                            </View>
                                            <View>
                                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14, color: "#073064" }}>Date of Birth</Text>
                                                <View className="flex-row items-center space-x-3">
                                                    <Image source={require("../../../assets/image/calendar.png")} style={{ width: 20, height: 20 }} />
                                                    <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: "#073064" }}>{formatDate(user?.birthDate)}</Text>
                                                </View>

                                            </View>
                                            <View>
                                                <Text className="font-Poppins-SemiBold" style={{ fontSize: 14, color: "#073064" }}>Address</Text>
                                                <View className="flex-row items-center space-x-3">
                                                    <Image source={require("../../../assets/image/pin.png")} style={{ width: 20, height: 20 }} />
                                                    <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: "#073064" }}>{user?.residenceAddress}</Text>
                                                </View>

                                            </View>
                                        </View>

                                            : <KeyboardAvoidingView
                                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                                style={{ flex: 1 }}
                                            >
                                                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                                    <View style={styles.container}>
                                                        <TouchableOpacity
                                                            className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md mb-2" style={{ borderColor: '#DBDBDB', borderWidth: 1 }}
                                                            onPress={() => setTogglerUser((prev) => !prev)}
                                                        >
                                                            <Ionicons name="chevron-back-outline" color="#073064" size={18} />
                                                        </TouchableOpacity>

                                                        {/* First Name */}
                                                        <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                                                            <Feather name="user" color="gray" size={20} />
                                                            <TextInput
                                                                placeholder="First Name"
                                                                value={formData.firstName}
                                                                onChangeText={(text) => handleChange('firstName', text)}
                                                                className="flex-1 font-Poppins-Light"
                                                                keyboardType="default"
                                                            />
                                                        </View>

                                                        {/* Last Name */}
                                                        <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                                                            <Feather name="user" color="gray" size={20} />
                                                            <TextInput
                                                                placeholder="Last Name"
                                                                value={formData.lastName}
                                                                onChangeText={(text) => handleChange('lastName', text)}
                                                                className="flex-1 font-Poppins-Light"
                                                                keyboardType="default"
                                                            />
                                                        </View>

                                                        {/* Email */}
                                                        <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                                                            <Ionicons name="mail-outline" size={20} color="gray" />
                                                            <TextInput
                                                                placeholder="Email Address"
                                                                value={formData.email}
                                                                onChangeText={(text) => handleChange('email', text)}
                                                                className="flex-1 font-Poppins-Light"
                                                                keyboardType="email-address"
                                                            />
                                                        </View>

                                                        {/* Birth Date */}
                                                        <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                                                            <Ionicons name="calendar-outline" size={20} color="gray" />
                                                            <TextInput
                                                                placeholder="Enter date (YYYY-MM-DD)"
                                                                value={formData.birthDate}
                                                                onChangeText={(text) => handleChange('birthDate', text)}
                                                                className="flex-1 font-Poppins-Light"
                                                                keyboardType="numeric"
                                                                maxLength={10}
                                                            />
                                                        </View>

                                                        {/* Address */}
                                                        <View className="flex-row space-x-2 items-center py-0" style={styles.input}>
                                                            <Feather name="map-pin" size={20} color="gray" />
                                                            <TextInput
                                                                placeholder="Enter your Address"
                                                                value={formData.residenceAddress}
                                                                onChangeText={(text) => handleChange('residenceAddress', text)}
                                                                className="flex-1 font-Poppins-Light"
                                                                keyboardType="default"
                                                            />
                                                        </View>

                                                        {/* Update Button */}
                                                        <TouchableOpacity
                                                            onPress={handleSubmit}
                                                            className="bg-[#073064] w-full rounded-lg flex-row justify-center items-center"
                                                            style={{ height: 50 }}
                                                        >
                                                            <Text className="text-white text-center font-Poppins-SemiBold">
                                                                Update
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </ScrollView>
                                            </KeyboardAvoidingView>
                                    }

                                </View>
                            }
                        </View>}
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center space-y-8 p-4 " style={{ backgroundColor: '#E6EAF0' }}>
                    <Image source={require('../../../assets/image/team.png')} />
                    <Image source={require('../../../assets/image/logo.png')} style={{ width: 190, height: 27 }} />
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        className="bg-[#073064] w-full p-2 rounded-xl"
                    >
                        <Text className="text-white text-center font-Poppins-SemiBold" >
                            Login Now !
                        </Text>
                    </TouchableOpacity>
                </View>

            )}

            <CustomModal visible={isModalVisible} onClose={() => { setIsModalVisible(false); fetchData(); }} />


            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View
                        className="p-4 bg-white rounded-md"
                        // style={{ width: containerWidth }}
                    >
                        <Text
                            className="font-Poppins-SemiBold text-center"
                            style={{ fontSize: 16, marginBottom: 16 }}
                        >
                            Are you sure you want to log out?
                        </Text>
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                className="p-2 bg-red-500 rounded w-32"
                                onPress={handleLogout}
                            >
                                <Text className="font-Poppins-Regular text-white text-center">Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="p-2 bg-gray-300 rounded w-32"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="font-Poppins-Regular text-black text-center">No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}; const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();
    return `${day}-${month}-${year}`;
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

export default ProfileScreen;
