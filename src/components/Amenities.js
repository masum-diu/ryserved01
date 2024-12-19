import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
const Amenities = ({ data }) => {
// console.log(data)
    return (
        <ScrollView >
            <View >
                {data?.map((item, index) => <View key={index}>
                    <View className=" mb-2 flex-row items-center space-x-3 mt-1" style={{ backgroundColor: "#fff", borderRadius: 4 ,height:40}}>

                    <Image source={{ uri: item?.icon }} style={{ width: 25, height: 25 }} />
                        <Text className="font-Poppins-SemiBold capitalize" style={{ color: "#073064",fontSize:14}}> {item?.name}</Text>
                        {/* <Text className="text-sm " style={{ color: "#B5B5B5" }}> Saturday - Friday </Text> */}
                    </View>

                </View>
                )}
            </View>
        </ScrollView>



    )
}

export default Amenities