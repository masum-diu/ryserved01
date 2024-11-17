import React from 'react';
import { View, Text } from 'react-native';

const Slider = ({ title, subtitle }) => (
    <View className="px-4">
        <Text className="font-Poppins-Bold">{title}</Text>
        <Text className="font-Poppins-Light" style={{
            color: "#B5B5B5"
        }}>{subtitle}</Text>
    </View>
);

export default Slider;
