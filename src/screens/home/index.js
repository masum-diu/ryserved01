import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Categories from '../../components/Categories'
import Ionicons from 'react-native-vector-icons/Ionicons';
const HomeScreen = () => {
  return (
    <View className="flex-1" style={{ backgroundColor: "#E6EAF0" }}>
      <ScrollView>
        <View style={{ backgroundColor: "#073064", }}>
          <TouchableOpacity  >
            <View className="flex-row space-x-3 flex-1 items-center  m-4 px-3"
              style={{ backgroundColor: "#ffff", borderRadius: 6, elevation: 2, borderColor: '#DBDBDB', borderWidth: 1, height: 40 }}>
              <Ionicons
                name='search-outline'
                size={20}
              />
              <Text className="font-Poppins-Bold">Where to?</Text>

            </View>
          </TouchableOpacity>
        </View>

        <Categories />
      </ScrollView>

    </View>


  )
}

export default HomeScreen