import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { TouchableOpacityBase } from 'react-native';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PromotionalBanner = ({ content }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === content.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
            });
        }
    }, [currentIndex]);
    const navigation = useNavigation();
    return (
        <View>
            <FlatList
                className="m-4 rounded-xl"
                ref={flatListRef}
                data={content}
                horizontal
                pagingEnabled
                renderItem={({ item }) => {
                     const id = item?.linkTo;
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("ViewRestaurant", { id })}>
                            <Image source={{ uri: item.bannerImage }} style={styles.image} />
                        </TouchableOpacity>

                    )
                }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: width - 32,
        height: 140,
        resizeMode: 'cover',
    },
});

export default PromotionalBanner;
