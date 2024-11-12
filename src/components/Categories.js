// Categories.js
import { ScrollView, Text, View } from 'react-native';
import React, { useState } from 'react';
import CategoryCard from './CategoryCard';


const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryPress = (category) => {
    // Toggle the selected category
    setSelectedCategory(selectedCategory === category ? category : category);
  };

  return (
    <View  >
      {/* <View className="flex-row mt-4 items-center justify-between px-4"> */}
      {/* <View className="flex-row items-center justify-between px-4"  > */}
      {/* <Text className="text-lg font-bold">Category</Text> */}
      {/* <Text className="text-lg font-medium" style={{ color: "#073064" }}>View All</Text> */}
      {/* <ArrowRightIcon color={"#00ccbb"} /> */}
      {/* </View> */}
      <View>

      </View >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
        horizontal
        showsHorizontalScrollIndicator={false}

      >

        <CategoryCard
          onPress={() => handleCategoryPress('All')}
          icon={"icons"}
          title="All"
          isSelected={selectedCategory === 'All'}
        />
        <CategoryCard
          onPress={() => handleCategoryPress('Hotel')}
          icon={"icons"}
          title="American"
          isSelected={selectedCategory === 'Hotel'}
        />
        <CategoryCard
          onPress={() => handleCategoryPress('Salon')}
          icon={"icons"}
          title="Offer"
          isSelected={selectedCategory === 'Salon'}
        />
        <CategoryCard
          onPress={() => handleCategoryPress('Other')}
          icon={"icons"}
          title="Other"
          isSelected={selectedCategory === 'Other'}
        />
      </ScrollView>

      {selectedCategory && (
        <View className="py-4">

          {selectedCategory === 'All' && (
            <View >
              <Text className="text-center flex-row justify-center items-center"> Home category Coming Soon...</Text>
            </View>
          )}
          {selectedCategory === 'Hotel' && (
            <Text className="text-center flex-row justify-center items-center"> American category Coming Soon...</Text>
          )}
          {selectedCategory === 'Salon' && (
            <Text className="text-center flex-row justify-center items-center"> Offer category Coming Soon...</Text>

          )}
          {selectedCategory === 'Other' && (
            <Text className="text-center flex-row justify-center items-center"> Other category Coming Soon...</Text>

          )}
          {/* Add more conditions for other categories as needed */}
        </View>
      )}
    </View>
  );
};

export default Categories;
