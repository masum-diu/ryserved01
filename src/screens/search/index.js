import { View, Text, Button } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import React from 'react'

const SearchScreen = () => {
    Geolocation.getCurrentPosition(info => console.log(info));
    return (
        <View className="h-full p-4" style={{ backgroundColor: "#E6EAF0" }}>
            <Text>SearchScreen</Text>

        </View>
    )
}

export default SearchScreen