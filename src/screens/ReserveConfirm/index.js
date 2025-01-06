import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, StyleSheet, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import instance from '../../api/api_instance'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
// const segmentClient = createClient({
//     writeKey: "az74SaeggTS7vT3uYDbUBumRx9xtGjrr",
// });
const ReserveConfirm = ({navigation}) => {
  // console.log(navigation)
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ConfirmLoading, setConfirmLoading] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };
  // const navigation = useNavigation();
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleToggle = () => {
    setChecked(!checked);
  };
  const [text, setText] = useState('');
  const { width, height } = Dimensions.get('window');
  const route = useRoute()
  // const { setUserDataUpdate } = useAuth()
  const { bookingInfo, restaurantname } = route.params || {}
  //  console.log(bookingInfo)
  


  const handleReservePress = async () => {
   

    try {
      setConfirmLoading(true)
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const response = await instance.post('/booking', {
          branchId: bookingInfo?.branchId,
          startDate: bookingInfo?.startDate,
          endDate: bookingInfo?.startDate,
          guestNumber: bookingInfo?.guestNumber,
          slot: bookingInfo?.slot,
          tableId:bookingInfo?.tableId,
          amount: 0,
          vat: 0,
          discount: 0,
          grandTotal: 0,
          customerRequest: text,
          status: "ON_HOLD",
          bookingType: bookingInfo?.bookingType

        }, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response?.data) {
          navigation.navigate('Home', { screen: 'Reservation' });
          // setUserDataUpdate(response?.data?.data)
          // console.log(response)
          // if (segmentClient && segmentClient.track) {
          //     segmentClient.track('Reservation status', { param1: 'value2' });
          // } else {
          //     console.error('Segment client or track method is not available');
          // }
          

        }
      }
      // Handle response as needed
      setConfirmLoading(false)
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
  };
  // console.log(bookingInfo)
  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: "#E6EAF0" }}>
      <ScrollView>
        <View className="p-4">
          <TouchableOpacity className="bg-white  h-8 w-8 flex-row items-center justify-center rounded-md" onPress={() => navigation.goBack()} >
            <Ionicons name="chevron-back-outline" size={20} />
          </TouchableOpacity>
          <View className=" p-6 bg-white bottom-0 mt-4" style={{ borderRadius: 12, elevation: 2 }}>

            <Text className="font-Poppins-SemiBold text-center" style={{ fontSize: 16 }} >
              {restaurantname?.restaurantname}
            </Text>


            <View className="flex-row  items-center justify-between mt-3" >
              <View className="flex-row items-center space-x-2">
                <Image source={require('../../../assets/image/Calendar1.png')} style={{ width: 20, height: 20 }} />
                <Text className="font-Poppins-Medium" style={{ fontSize: 12 }}>{bookingInfo?.startDate}</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image source={require('../../../assets/image/team.png')} style={{ width: 20, height: 20 }} />
                <Text className="font-Poppins-Medium" style={{ fontSize: 12 }}>{bookingInfo?.guestNumber} Guest</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image source={require('../../../assets/image/clock.png')} style={{ width: 20, height: 20 }} />
                <Text className="font-Poppins-Medium" style={{ fontSize: 12 }}>{bookingInfo?.slot}</Text>
              </View>

            </View>



          </View>
          
          <View className="pt-6">
            <Text className="font-Poppins-SemiBold" style={{ fontSize: 14 }}>What to know before you go</Text>
            <Text className="font-Poppins-SemiBold" style={{ fontSize: 12, color: "#979797" }}>Important dining information</Text>
            <Text className="pt-3 font-Poppins-Light" style={{ fontSize: 12, textAlign: "justify" }}>We have a 5 minute grace period. Please call us if you
              are running later than 5 minutes your reservation time</Text>
            <Text className="pt-3 font-Poppins-Light" style={{ fontSize: 12, textAlign: "justify" }}>We may contact you about this reservation, so please
              ensure your email and phone number are up to date.</Text>
            <Text className="pt-3 font-Poppins-SemiBold" style={{ fontSize: 12, color: "#979797" }}>Notes for tonight</Text>
            <Text className="pt-3 font-Poppins-Light" style={{ fontSize: 12 }}> {restaurantname?.restaurantname} is a unique dining experience</Text>
            <Text className="pt-3 font-Poppins-Light" style={{ fontSize: 12, textAlign: "justify" }}>We have a 5 minute grace period. Please call us if you
              are running later than 5 minute after your reservation
              we may contact your about this reservation, so please
              ensure your email and phone number are up to date.</Text>
            <Text className="pt-3 font-Poppins-SemiBold" style={{ fontSize: 12, color: "#979797" }}>Notes for tonight</Text>
            <View className="pt-3">
              <Text className="font-Poppins-Light" style={styles.listItem}>
                •  {restaurantname?.restaurantname} is a unique dining experience
              </Text>
              <Text className="font-Poppins-Light" style={styles.listItem}>
                • It is a long established fact that a reader will be
              </Text>
              <Text className="font-Poppins-Light" style={styles.listItem}>
                • By the readable content of a page when looking at
              </Text>
              <Text className="font-Poppins-Light" style={styles.listItem}>
                • Using Lorem Ipsum is that it has a more-or-less
              </Text>
            </View>
            <Text className="pt-3 font-Poppins-SemiBold" style={{ fontSize: 14 }}>Any special request?</Text>
            <View className="pt-3" style={styles.container}>
              <TextInput
                className="h-20 font-Poppins-Light"
                style={styles.textInput}
                multiline={true}
                numberOfLines={5}
                placeholder="Add special request here..."
                value={text}
                onChangeText={setText}

              />
            </View>
          </View >
          <View className="flex-row space-x-3 pt-3 items-center" >
            <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggle}>
              <FontAwesome5 name={checked ? 'check-square' : 'square'} size={25} color="#0E0E0E" />
              {/* <FontAwesome5  name={checked ? 'check-square' : 'square-o'} size={24} color={checked ? 'black' : 'black'} /> */}

            </TouchableOpacity>
            <Text className="font-Poppins-Light" style={{ fontSize: 12, textAlign: "justify" }}>By reservation you agree {bookingInfo?.restaurantName}
            </Text></View>
          <TouchableOpacity className="font-Poppins-Light" onPress={openModal}><Text className="font-Poppins-Light" style={{ fontSize: 12, textAlign: "justify", textDecorationLine: "underline" }}><Text className="font-Poppins-Medium" style={styles.deff}>Privacy Policy</Text> and <Text className="font-Poppins-Medium" style={styles.deff}>Terms</Text> and <Text className="font-Poppins-Medium" style={styles.deff}>Condition</Text></Text></TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <TouchableOpacity style={{ width: width * .90 }} className="mb-2 flex-row justify-end items-end " onPress={closeModal}>
                <Ionicons name="close-circle-outline" size={30} color="#fff" />
                {/* <AntDesign name="closecircleo" size={30} color="#ffff" /> */}
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5, maxHeight: height * .80, width: width * .90 }}>
                <ScrollView>
                  <Text style={{ fontFamily: "Light", fontSize: 12, textAlign: "justify" }}>{bookingInfo?.trams}</Text>
                </ScrollView>
                {/* <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: "#073064", borderRadius: 6 }} onPress={closeModal}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 12, color: 'white', textAlign: 'center' }}>Done</Text>
                                </TouchableOpacity> */}
              </View>
            </View>
          </Modal>

          {ConfirmLoading ? <View className="w-full flex-row justify-center mt-3"><Text ><ActivityIndicator className="mt-2" size={24} color="#073064" /> </Text></View> : <TouchableOpacity className="mt-4 mb-3" style={[styles.getStartedButton, { opacity: checked ? 1 : 0.5 }]} onPress={handleReservePress} disabled={!checked}>
            <Text className="font-Poppins-SemiBold" style={styles.buttonText}>Reserve Confirm</Text>
          </TouchableOpacity>}

        </View>
      </ScrollView>
    </SafeAreaView>


  )
}
const styles = StyleSheet.create({
  listItem: {
    marginLeft: 10,
    marginBottom: 5,
    // fontFamily: "Light",
    fontSize: 12
  },
  container: {
    flex: 1,
    elevation: 2
    // padding: 20,
    // justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    // fontFamily: "Light",
    fontSize: 12,
    textAlignVertical: "top"

  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  label: {
    marginLeft: 8,

  },
  deff: {
    // fontFamily: "SemiBold",
    fontSize: 12,
    color: '#073064'
  },
  getStartedButton: {
    backgroundColor: '#073064',
    padding: 11,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    // fontFamily: "SemiBold"
  },
});

export default ReserveConfirm