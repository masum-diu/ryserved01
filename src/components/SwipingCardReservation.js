import { TouchableOpacity, Text, Image, View, Dimensions } from 'react-native'
import React from 'react'
const SwipingCardReservation = ({ icon, title, onPress, isSelected }) => {
      const { width, height } = Dimensions.get('window');
    return (
        <TouchableOpacity onPress={onPress} className=" flex-row items-center p-2 rounded-md justify-center " style={{ backgroundColor: isSelected ? '#073064' : '#DBDBDB',width:width*.45}}>
           {/* <View >{icon}</View>  */}
            <Text className="font-Poppins-SemiBold text-xs text-center flex-row justify-center items-center" style={{color: isSelected ? "#ffff" : "#000"}}>{title} </Text>
        </TouchableOpacity>
    )
}

export default SwipingCardReservation