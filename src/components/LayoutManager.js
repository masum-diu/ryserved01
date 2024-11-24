import React, { useCallback } from 'react';
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

const LayoutManager = ({ data, isLoading }) => {
    const navigation = useNavigation();

    const handleCategoryPress = useCallback((category) => {
        navigation.navigate('CategoryPage', { category });
    }, [navigation]);


    const renderPatternComponent = (item) => {
        switch (item.pattern) {
            case 'promotional-banner':
                return <PromotionalBanner key={item.id} content={item.content} />;
            case 'slider':
                return <Slider key={item.id} title={item.title} subtitle={item.subtitle} content={item.content} signature={item.signature} />;
            case 'banner-ads':
                return <BannerAds key={item.id} content={item.content} />;
            case 'promotional-logo':
                return <Promotionallogo key={item.id} content={item.content} title={item.title} subtitle={item.subtitle} />;
            case 'food-promotion':
                return <Foodpromotion key={item.id} content={item.content} title={item.title} subtitle={item.subtitle} />;
            default:
                return null;
        }
    };

    return (
        <ScrollView className="mb-12" >
            <View>
                <View style={{ backgroundColor: '#073064' }}>
                    <TouchableOpacity>
                        <View
                            className="flex-row space-x-3  items-center m-4 px-3"
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
                    {data?.map((item) => (
                        <CategoryCard
                            key={item.id}
                            onPress={() => handleCategoryPress(item)}
                            title={item.title}
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
