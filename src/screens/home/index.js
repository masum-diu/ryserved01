import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategoryCard from '../../components/CategoryCard';
import { useNavigation } from '@react-navigation/native';
import LayoutManager from '../../components/LayoutManager';
import layoutData from '../../../layoutData.json'
const HomeScreen = () => {
  const cuisine = [
    { title: "American", id: 1 },
    { title: "Italian", id: 2 },
    { title: "Mexican", id: 3 },
    { title: "Chinese", id: 4 },
    { title: "Japanese", id: 5 },
  ]
  const navigation = useNavigation();

  const handleCategoryPress = useCallback((category) => {
    navigation.navigate('CategoryPage', {category});
  }, [navigation]);
  
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

        <ScrollView
        className="mb-2"
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
          horizontal
          showsHorizontalScrollIndicator={false}

        >

          {cuisine?.map((item, index) =>
            <CategoryCard
              key={index}
              onPress={() => handleCategoryPress(item)}
              title={item?.title}

            />)}
        </ScrollView>
        <LayoutManager data={layoutData} />
      </ScrollView>

    </View>


  )
}

export default HomeScreen