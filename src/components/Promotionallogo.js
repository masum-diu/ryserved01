import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import instance from '../api/api_instance';

const { width } = Dimensions.get('window');

const Promotionallogo = ({ content, title, subtitle, signature }) => {
    const [loading, setLoading] = useState(false);
    const [promotionallogoData, setPromotionallogoData] = useState([]);
    const fetchSliderData = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/property?group=RESTAURANT&signature=${signature}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setPromotionallogoData(response?.data?.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliderData();
    }, []);

    return (
        <View style={styles.container} className="mt-5">
            {/* Title */}
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12 }}>{title}</Text>
            <Text className="font-Poppins-Medium pb-2 px-4" style={{ fontSize: 10, color: "#B5B5B5" }}>{subtitle}</Text>

            {/* ScrollView with Spacing */}
            <ScrollView
                className="bg-white"
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                style={styles.scrollView}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {loading ? <ActivityIndicator size="small" color="#073064" /> :
                    promotionallogoData?.map((item, index) => (
                        <View className="space-y-2 mr-5" key={index} style={styles.imageContainer}>
                            <Image source={{ uri: item.logo }} style={styles.image} />
                            <Text className="font-Poppins-SemiBold text-xs text-center" style={{ color: "#073064" }}></Text>
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#DBDBDB',
        overflow: 'hidden',
    },
});

export default Promotionallogo;
