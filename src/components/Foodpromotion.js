import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import instance from '../api/api_instance';

const { width } = Dimensions.get('window');

const Foodpromotion = ({ content, title, subtitle, signature }) => {
    const [loading, setLoading] = useState(false);
    const [foodpromotionData, setFoodpromotionData] = useState([]);
    const fetchSliderDataFoodpromotion = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/property-food/${signature}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setFoodpromotionData(response?.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliderDataFoodpromotion();
    }, []);
    return (
        <View style={styles.container} className="pt-5 mb-20">
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12, color: "#FFF" }}>{title}</Text>
            <Text className="font-Poppins-Medium px-4 pb-3" style={{ fontSize: 10, color: "#B5B5B5" }}>{subtitle}</Text>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 15, }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {foodpromotionData?.food?.map((item, index) => (
                    <View className=" mr-3 flex-col" key={index} style={styles.imageContainer}>
                        <Image source={{ uri: item.images[0] }} style={styles.image} />

                    </View>
                ))}


            </ScrollView>
            <View className="flex-row m-4 space-x-6 pt-3 ">
                <View className="flex-row space-x-4">
                    {foodpromotionData.logo && (
                        <View>
                            <Image
                                source={{ uri: foodpromotionData.logo }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 8,
                                    resizeMode: 'cover',
                                    borderWidth: 1,
                                    borderColor: '#DBDBDB',
                                    backgroundColor: "#fff",
                                }}
                            />
                        </View>
                    )}

                </View>
                <View>
                    {/* <Image
                        source={require('../../assets/image/Line 1.png')}
                        style={{
                            width: 20,
                            height: 80,
                        }}
                    /> */}
                    <Text className="font-Poppins-Bold" style={{ fontSize: 12, color: "#FFF" }}>
                        {foodpromotionData.listingName}
                    </Text>
                    <Text
                        className="font-Poppins-Medium"
                        style={{ fontSize: 8, color: "#B5B5B5" }}
                    >
                        {foodpromotionData?.cuisines?.join(', ')}
                    </Text>

                    {/* 
                    <Text className="font-Poppins-Medium" style={{ fontSize: 8, color: "#B5B5B5" }}>
                        {item.address} }c
                    </Text> */}
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        backgroundColor: "#041D3C"
    },

    image: {
        width: 156,
        height: 100,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});

export default Foodpromotion;
