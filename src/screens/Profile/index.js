import { View, Text, Image } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ProfileScreen = () => {
    return (
        <View className="p-4 h-full space-y-5" style={{ backgroundColor: "#E6EAF0" }}>
            <View className="flex-col justify-center items-center space-y-2">
                <Image source={require('../../../assets/image/12594.png')} style={{ width: 90, height: 90 }} />
                <Text className="font-Poppins-Bold" style={{ fontSize: 16 }}>Md Masum Mollah</Text>
            </View>
            <View className="p-4 space-y-3" style={{ backgroundColor: "#ffff", height: 481, borderRadius: 12, width: 332 }}>
                <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>My Account</Text>
                <View className="flex-row space-x-2">
                    <Feather name="user" color={"#DC4A45"} size={24} />
                    <Text className="font-Poppins-Medium" style={{ fontSize: 16 }}>Personal information</Text>
                </View>
                <View className="flex-row space-x-2">
                    <Ionicons name="language-outline" color={"#DC4A45"} size={24} />
                    <Text className="font-Poppins-Medium" style={{ fontSize: 16 }}>Language</Text>
                </View>
                <View className="flex-row space-x-2">
                    <Feather name="checkmark-circle" color={"#DC4A45"} size={24} />
                    <Text className="font-Poppins-Medium" style={{ fontSize: 16 }}>Privacy Policy</Text>
                </View>
                <View className="flex-row space-x-2">
                    <Feather name="settings" color={"#DC4A45"} size={24} />
                    <Text className="font-Poppins-Medium" style={{ fontSize: 16 }}>Setting</Text>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen