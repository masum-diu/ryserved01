import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'; 
const Overview = ({ data }) => {
  console.log(data)
  return (
    <View>
      <ScrollView>
        <View >
          <View className="space-y-2 mb-4" >
            <Text className=" font-Poppins-SemiBold" style={{ color: "#073064",fontSize:16 }}>About</Text>
            <Text className=" text-justify font-Poppins-Light" style={{ color: "#979797",fontSize:14 }}>{data?.description}</Text>
          </View>
          <View className="space-y-2 mb-4" >
            <Text className=" font-Poppins-SemiBold" style={{ color: "#073064",fontSize:16 }}>House Rules</Text>
            <Text className=" text-justify font-Poppins-Light" style={{ color: "#979797",fontSize:14 }}>{data?.terms}</Text>
          </View>
          <View className="space-y-2 mb-4" >
            <Text className="font-Poppins-SemiBold" style={{ color: "#073064",fontSize:16 }}>Opportunities</Text>
            <View className="flex-row flex-wrap">
              {data?.amenities?.map((item, index) => <Text className=" flex-row capitalize font-Poppins-Light" key={index} style={{ color: "#979797",fontSize:14 }}>{item?.name}, </Text>)}
            </View>


          </View>
          <View className="space-y-2 mb-4" >
            <Text className=" font-Poppins-SemiBold" style={{ color: "#073064",fontSize:16 }}>Opening hours</Text>
            <View className="flex-row items-center space-x-2">
              <View className="flex-row items-center space-x-1">
                {/* <ClockIcon color={"orange"} /> */}
                <Feather name="clock" color="#E49542" size={20} />
                <Text className=" font-Poppins-Medium" style={{ color: "#979797",fontSize:14 }}> 10:00 AM - 11:00 PM </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                {/* <CalendarDaysIcon color={"#DA4A54"} /> */}
                <Feather name="calendar" color="#DA4A54" size={20} />
                <Text className=" font-Poppins-Medium" style={{ color: "#979797",fontSize:14 }}> Saturday - Friday </Text>
              </View>

            </View>

          </View>
          {/* <View className="space-y-2 mb-4" >
                    <Text className="text-lg font-semibold" style={{ color: "#073064", fontFamily: "SemiBold" }}>Contact</Text>
                    <View className="flex-row items-center space-x-2">
                        <PhoneIcon color={"#073064"} />
                        <Text className="text-sm " style={{ color: "#073064", fontFamily: "Medium" }}>{data?.asset?.business?.businessManager }</Text>
                    </View>
                </View> */}
          <View className="space-y-2 mb-4" >
            <Text className=" font-Poppins-SemiBold" style={{ color: "#073064",fontSize:16 }}>Address</Text>
            <TouchableOpacity >
              <View className="space-x-1" style={{ flexDirection: 'row', alignItems: 'center', }}>
                {/* <MapPinIcon color={"#DA4A54"} /> */}
                 <Feather name="map-pin" color="#DC4A45" size={20} />
                <Text className="underline-offset-8 underline font-Poppins-Medium" style={{ color: "#979797", fontSize: 14, }}>{data?.address}</Text>
              </View>
            </TouchableOpacity>

          </View>



        </View>
      </ScrollView>
    </View>
  )
}

export default Overview