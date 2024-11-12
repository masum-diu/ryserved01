import { TouchableOpacity, Text, Image, View } from 'react-native'
import React from 'react'
const CategoryCard = ({ icon, title, onPress, isSelected }) => {

    return (
        <TouchableOpacity onPress={onPress} className="mr-2 flex-row items-center p-3 rounded-md space-x-2 mt-3 " style={{ backgroundColor: isSelected ? '#073064' : '#FFFF',  }}>
           <View >{icon}</View> 
            <Text className="font-semibold text-md" style={{color: isSelected ? "#ffff" : "#000",fontFamily:"SemiBold"}}>{title} </Text>
        </TouchableOpacity>
    )
}

export default CategoryCard