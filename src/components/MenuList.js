import { View, Text, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import MenuCard from './MenuCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
const MenuList = ({ menu }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    // console.log(selectedItem)
    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    return (
        <View>
            <ScrollView showsHorizontalScrollIndicator={false}>
                {menu.length > 0 ? (
                    menu.map((item, index) => (
                        <MenuCard
                            key={index}
                            imgUrl={item?.images?.[0]}
                            title={item?.name}
                            rating={item?.description}
                            address={item?.price[0]?.small}
                            onPress={() => openModal(item)}
                        />
                    ))
                ) : (
                    <Text style={{ padding: 10, color: '#B5B5B5' }}>No data available</Text>
                )}
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            width: '90%',
                        }}
                    >
                        {selectedItem && (
                            <>
                                <View className="relative">
                                    <Image
                                        className="rounded-t-lg"
                                        source={{ uri: selectedItem?.images?.[0] }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)} 
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10, 
                                            backgroundColor: 'white', 
                                            padding: 5,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Ionicons name='close-outline' size={18} />
                                    </TouchableOpacity>
                                </View>


                                <View className="p-4">
                                    <Text
                                        className="font-Poppins-Bold"
                                        style={{
                                            fontSize: 16,
                                        }}
                                    >
                                        {selectedItem?.name}
                                    </Text>
                                    <Text
                                        className="font-Poppins-Medium"
                                        style={{
                                            fontSize: 14,
                                            color: '#0E0E0E',
                                        }}
                                    >
                                        TK {selectedItem?.price[0]?.small}
                                    </Text>
                                    <Text
                                        className="font-Poppins-Regular"
                                        style={{
                                            fontSize: 10,
                                            color: '#B5B5B5',
                                        }}
                                    >
                                        {selectedItem?.description}
                                    </Text>


                                    {/* Close Button */}
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={{
                                            marginTop: 20,
                                            backgroundColor: '#E63946',
                                            padding: 10,
                                            borderRadius: 5,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text className="font-Poppins-SemiBold" style={{ color: 'white', fontSize: 12 }}>
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MenuList;
