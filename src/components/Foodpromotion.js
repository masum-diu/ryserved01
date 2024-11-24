import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const Foodpromotion = ({ content, title, subtitle }) => {
    return (
        <View style={styles.container} className="pt-5">
            {/* Title */}
            <Text className="font-Poppins-Bold px-4" style={{ fontSize: 12, color: "#FFF" }}>{title}</Text>
            <Text className="font-Poppins-Medium px-4 pb-3" style={{ fontSize: 10, color: "#B5B5B5" }}>{subtitle}</Text>

            {/* ScrollView with Spacing */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {content?.map((item, index) => (
                    <View className="space-y-5 mr-3" key={index} style={styles.imageContainer}>
                        {/* Banner Image */}
                        <Image source={{ uri: item.bannerImage }} style={styles.image} />
                        {/* Logo and Details */}
                        <View className="flex-row space-x-4">
                            {/* Render Logo Only if item.logo Exists */}
                            {item.logo && (
                                <View>
                                    <Image
                                        source={{ uri: item.logo }}
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
                            {/* Details */}

                            
                            <View>
                                <Text className="font-Poppins-Bold" style={{ fontSize: 12, color: "#FFF" }}>
                                    {item.title}
                                </Text>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 8, color: "#B5B5B5" }}>
                                    {item.subtitle}
                                </Text>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 8, color: "#B5B5B5" }}>
                                    {item.address}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

            </ScrollView>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        backgroundColor: "#041D3C"
    },
    scrollView: {
        flex: 1,
        height: 250,


    },

    image: {
        width: 156,
        height: 100,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});

export default Foodpromotion;
