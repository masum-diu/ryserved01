import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const Promotionallogo = ({ content, title, subtitle }) => {
    return (
        <View style={styles.container} className="mt-5">
            {/* Title */}
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12 }}>{title}</Text>
            <Text className="font-Poppins-Medium pb-2 px-4" style={{ fontSize: 10 ,color:"#B5B5B5"}}>{subtitle}</Text>

            {/* ScrollView with Spacing */}
            <ScrollView
                className="bg-white"
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                style={styles.scrollView}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {content?.map((item, index) => (
                    <View className="space-y-2 mr-5" key={index} style={styles.imageContainer}>
                        <Image source={{ uri: item.bannerImage }} style={styles.image} />
                        <Text className="font-Poppins-SemiBold text-xs text-center" style={{ color: "#073064" }}>KFC</Text>
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
    scrollView: {
        flex: 1,
        height: 120,
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
