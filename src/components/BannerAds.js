import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BannerAds = ({ content }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                horizontal
                pagingEnabled
                renderItem={({ item }) => (
                    <Image source={{ uri: item.bannerImage }} style={styles.image} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical:16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: width - 32,
        height: 140,
        resizeMode: 'cover',
    },
});

export default BannerAds;
