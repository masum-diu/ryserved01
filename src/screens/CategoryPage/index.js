import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AllRestaurantsListCard from '../../components/AllRestaurantsListCard';

const CategoryPageScreen = ({ navigation }) => {
    const route = useRoute();
    const { category } = route.params;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000); 
    }, []);

    return (
        <ScrollView style={{ backgroundColor: "#E6EAF0" }}>
            <View className="m-4 space-y-4">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity 
                        className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md" 
                        style={{ borderColor: '#DBDBDB', borderWidth: 1 }} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back-outline" size={20} />
                    </TouchableOpacity>
                    <Text> </Text>
                    <Text className="font-Poppins-SemiBold">{category?.title}</Text>
                    <Text> </Text>
                    <Text> </Text>
                </View>

                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                        <ActivityIndicator size="large" color="#073064" />
                        <Text className="font-Poppins-Light">Loading...</Text>
                    </View>
                ) : (
                    <View>
                        <AllRestaurantsListCard imgUrl="https://eltorobd.com/images/img-01.jpg" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                        <AllRestaurantsListCard imgUrl="https://media.gettyimages.com/id/1983342381/photo/culinary-delights-display-yokohama-chinatown-food-models.jpg?s=612x612&w=0&k=20&c=w7cfujuvC9GBCmHlCnHx04y17gbv4c3mvHvBAT5Gh3Y=" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                        <AllRestaurantsListCard imgUrl="https://media.gettyimages.com/id/1983342381/photo/culinary-delights-display-yokohama-chinatown-food-models.jpg?s=612x612&w=0&k=20&c=w7cfujuvC9GBCmHlCnHx04y17gbv4c3mvHvBAT5Gh3Y=" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                        <AllRestaurantsListCard imgUrl="https://media.gettyimages.com/id/1983342381/photo/culinary-delights-display-yokohama-chinatown-food-models.jpg?s=612x612&w=0&k=20&c=w7cfujuvC9GBCmHlCnHx04y17gbv4c3mvHvBAT5Gh3Y=" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                        <AllRestaurantsListCard imgUrl="https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/mqobygcn/3a846780-67ee-4e0b-b3f3-2e1a32ca1de1.jpg" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                        <AllRestaurantsListCard imgUrl="https://media.gettyimages.com/id/1983342381/photo/culinary-delights-display-yokohama-chinatown-food-models.jpg?s=612x612&w=0&k=20&c=w7cfujuvC9GBCmHlCnHx04y17gbv4c3mvHvBAT5Gh3Y=" title={category?.title} address={"Gulshan 2"} rating={4.7} distance={"1.2 km"} />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default CategoryPageScreen;
