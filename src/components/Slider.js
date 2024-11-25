import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import PopularRestaurantsCard from './PopularRestaurantsCard';
import instance from '../api/api_instance';

const Slider = ({ title, subtitle, content, signature }) => {
    const [loading, setLoading] = useState(false);
    const [sliderData, setSliderData] = useState([]);
    console.log(sliderData)
    const fetchSliderData = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/property?group=RESTAURANT&signature=${signature}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSliderData(response?.data?.data);
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
        <View>
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12 }}>{title}</Text>
            <Text className="font-Poppins-Medium px-4" style={{ fontSize: 10, color: "#B5B5B5" }}>{subtitle}</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#073064" />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {sliderData.length > 0 ? (
                        sliderData?.map((item, index) => (
                            <PopularRestaurantsCard
                                key={index}
                                imgUrl={item?.images?.[0]?.link}
                                title={item?.listingName}
                            />
                        ))
                    ) : (
                        <Text style={{ padding: 10, color: "#B5B5B5" }}>No data available</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default Slider;
