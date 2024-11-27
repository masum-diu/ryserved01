import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SelectModal from './SelectModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CustomSelectList = ({ options, selectedValue, onValueChange, placeholder }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (value) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View>
            {/* Display Selected Value */}
            <TouchableOpacity
                className="bg-white flex-row items-center justify-between p-1 rounded-lg"
                style={{ width: 115 }}
                onPress={() => setModalVisible(true)}
            >
                <Text className="font-Poppins-Medium px-1 " style={{fontSize:12}}>
                    {selectedValue || placeholder || 'Select'}
                </Text>
                <View className="rounded-md text-center flex-row justify-center items-center p-1 " style={{ width: 30, backgroundColor: "#DAE0E8", color: "#073064" }}>
                    <Ionicons name="chevron-down-outline"   size={14} />
                </View>

            </TouchableOpacity>

            {/* Modal Component */}
            <SelectModal
                visible={modalVisible}
                options={options}
                onSelect={handleSelect}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    selectBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: 200,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomSelectList;
