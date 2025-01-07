import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PromotionalBanner from './PromotionalBanner';
import Slider from './Slider';
import BannerAds from './BannerAds';
import Promotionallogo from './Promotionallogo';
import Foodpromotion from './Foodpromotion';
import CategoryCard from './CategoryCard';
import AllRestaurantsListCard from './AllRestaurantsListCard';
import { useNavigation } from '@react-navigation/native';
import instance from '../api/api_instance';
import EventSlider from './EventSlider';

const LayoutManager = ({ data, isLoading }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [cuisineData, setCuisineData] = useState([]);
    const fetchDatacuisine = async () => {
        try {
            setLoading(true);
            const response = await instance.get('/cuisine', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setCuisineData(response?.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatacuisine();
    }, []);


    const handleCategoryPress = useCallback((category) => {
        navigation.navigate('CategoryPage', { category });
    });


    const renderPatternComponent = (item) => {
        switch (item.pattern) {
            case 'promotional-banner':
                return <PromotionalBanner key={item.id} content={item.content} />;
            case 'slider':
                return <Slider key={item.id} title={item.title} subtitle={item.subtitle} content={item.content} signature={item.signature} />;
            case 'banner-ads':
                return <BannerAds key={item.id} content={item.content} />;
            case 'promotional-logo':
                return <Promotionallogo key={item.id} content={item.content} title={item.title} subtitle={item.subtitle} signature={item.signature} />;
            case 'food-promotion':
                return <Foodpromotion key={item.id} content={item.content} title={item.title} subtitle={item.subtitle} signature={item.signature} />;
            case 'event-slider':
                return <EventSlider key={item.id} title={item.title} subtitle={item.subtitle} content={item.content} signature={item.signature} />;
            default:
                return null;
        }
    };

    return (
        <ScrollView  className="mb-20">
            <View>
                <View style={{ backgroundColor: '#073064' }}>
                    <TouchableOpacity onPress={() =>  navigation.navigate('Home', { screen: 'Search' })}>
                        <View
                            className="flex-row space-x-3 items-center m-4 px-3"
                            style={{
                                backgroundColor: '#ffff',
                                borderRadius: 6,
                                borderColor: '#DBDBDB',
                                borderWidth: 1,
                                height: 40,
                            }}
                        >
                            <Ionicons name="search-outline" size={20} />
                            <Text className="font-Poppins-Bold">Where to?</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="mb-2"
                    contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {cuisineData?.map((item) => (
                        <CategoryCard
                            key={item.id}
                            onPress={() => handleCategoryPress(item.name)}
                            title={item.name}
                        />
                    ))}
                </ScrollView>
            </View>


            {data.map((item) => (
                <View key={item.id}>{renderPatternComponent(item)}</View>
            ))}
        </ScrollView>
    );
};

export default LayoutManager;
