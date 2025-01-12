import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import AllRestaurantsListCard from './AllRestaurantsListCard'
import { Text } from 'react-native'

const SearchResult = ({ sliderData, loading }) => {
    return (

        <View className="mb-36 mt-3">
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator size="large" color="#073064" />

                </View>
            ) : (
                sliderData?.length > 0 ? (
                    sliderData?.map((item, index) => (
                      
                            <AllRestaurantsListCard
                                key={index}
                                imgUrl={item?.images?.[0]?.link}
                                title={item?.listingName}
                                id={item?.id}
                                address={item?.branches?.[0]?.area}
                                rating={4.7}

                            />
                      
                    ))
                ) : (

                    <Text className="font-Poppins-Light text-center">No data available</Text>

                )
            )}
        </View>

    )
}

export default SearchResult
