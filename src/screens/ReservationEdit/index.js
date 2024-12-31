import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../api/api_instance';
import CalenderComponents from '../../components/CalenderComponents';
import { useAuth } from '../../util/AuthContext';
import CustomSelectList from '../../components/CustomSelectList';

const ReservationEdit = ({ route }) => {
  const { id, resID, distance } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ConfirmLoading, setConfirmLoading] = useState(false);
  const [selectDate, setSelectDate] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [timeslot, setTimeslot] = useState([])
  const [count, setCount] = useState(1);
  const [todaySlot, setTodaySlot] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [data, setData] = useState(null);
  const dateString = selectDate;
  const navigation = useNavigation()
  const { width, height } = Dimensions.get('window')
  const positions = data?.branches?.[0]?.tables?.map(table => ({
    id: table?.id,
    position: table?.position,
})) || [];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  useEffect(() => {
    setLoading(true);
    instance.get(`/property/${resID}`)
      .then(response => {
        setData(response?.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);
  useEffect(() => {
    setVisible(true);
  }, []);
  useEffect(() => {

    if (data && Array.isArray(data.slot)) {
      const date = new Date(dateString);
      const dayOfWeekNumber = date.getDay();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = daysOfWeek[dayOfWeekNumber];

      // Find slots for today
      const todaySlots = data.slot.find(daySlots => daySlots.hasOwnProperty(today));

      if (todaySlots && todaySlots[today]) {
        // Extracting only the times for today
        const availableTimes = todaySlots[today]
          .filter(slot => slot?.status) // Filter out only available slots
          .map(slot => slot?.slottime); // Extract slot times

        // Update state with available times for today
        setTimeslot(availableTimes);

        // console.log(availableTimes); // Print or use the available times as needed
      } else {
        setTimeslot([]);
        console.log("No slots available for today.");
      }
    } else {
      setTimeslot([]);
      console.log("No data available or incorrect data format.");
    }
  }, [dateString, data]); // Add dependencies: dateString and getdata
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / 100); // Assuming each image has a width of 100
    setCurrentImageIndex(newIndex);
  };
  const handleTimeSlotPress = (slot) => {
    setSelectedSlot(slot === selectedSlot ? null : slot);
    setTodaySlot(slot === selectedSlot ? null : slot);
  };
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    // Ensure count doesn't go below 1
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };
  const { token, setRealTimeUpdate } = useAuth()

  const { setUserDataUpdate1 } = useAuth()
  const handleUpdateReservePress = async () => {
    if (timeslot.length === 0 || !selectedSlot) {
      return; // Do nothing if the button is disabled
    }
    try {
      setConfirmLoading(true)
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const response = await instance.put(`/booking/${id}`, {
          startDate: selectDate,
          endDate: selectDate,
          guestNumber: count,
          slot: todaySlot,


        }, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response?.data) {
          setUserDataUpdate1(response?.data)
          navigation.navigate('Home', { screen: 'Reservation' });
        }
      }
      // Handle response as needed
      setConfirmLoading(false)
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
  };
  
  return (
    <SafeAreaView className="h-full " style={{ backgroundColor: "#E6EAF0" }}>
      {loading ? <View className="h-full flex-row justify-center items-center"><ActivityIndicator className="mt-2" size={24} color="#073064" /></View> : <ScrollView>

        <View className="relative">

          {/* <Image
    className="rounded-b-xl"
    source={{ uri: data?.image }}
    style={{ width: "100%", height: 280, }} // Set your desired width and height
  /> */}
          <ScrollView horizontal={true} onScroll={handleScroll}>
            {data?.branches[0]?.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.link }}
                style={{ width: width, height: 280, }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity className="bg-white absolute mx-3 mt-4 h-8 w-8 flex-row items-center justify-center rounded-md" onPress={() => navigation.goBack()} style={{ borderColor: '#DBDBDB', borderWidth: 1 }} >
            {/* <ChevronLeftIcon color={"#073064"} size={20} /> */}
            <Ionicons name="chevron-back-outline" size={20} />
          </TouchableOpacity>
          {/* <TouchableOpacity className="bg-white absolute mr-3 mt-4 right-0 h-8 w-8 flex-row items-center justify-center rounded-md" >
            <BookmarkIcon color={"#073064"} size={20} />
          </TouchableOpacity> */}



          {/* <AllRestaurantsList /> */}
        </View>
        <View className="relative h-14 flex justify-center items-center">

          <View className=" p-4 bg-white absolute  bottom-0 " style={{ width: width * 0.90, borderRadius: 12, elevation: 2 }}>
            <View className="flex-row justify-between items-center">
              <Image

                source={{ uri: data?.logo }}
                style={{ width: 35, height: 35, borderRadius: 4 }} // Set your desired width and height
              />
              <View >
                <Text className="font-Poppins-SemiBold text-left" style={{ fontSize: 14 }}>
                  {data?.listingName}
                </Text>
                <Text className="font-Poppins-Bold text-left" style={{ color: "#B5B5B5", fontSize: 12 }}>
                  {data?.title}
                </Text>
              </View>
              <Text></Text>
            </View>
            <View className="flex-row pt-2 items-center  space-x-4 justify-center" >
              <Text className="flex-row items-center" style={{ color: "#DC4A45" }}>
                {/* <MapPinIcon color={"#DC4A45"} size={14} /> {data?.asset?.area} */}
              </Text>
              <Text className="flex-row items-center" style={{ color: "#073064" }}>
                {/* <Image source={require('../assets/send.png')} style={{ width: 12, height: 12 }} /> {distance} */}
              </Text>
              <View className="flex-row items-center space-x-1">
                {/* <CheckCircleIcon color={"#17C964"} size={14} /> */}

                {/* <Text className="flex-row items-center" style={{ color: "#17C964" }}>
                  Open
                </Text> */}

              </View>

            </View>

          </View>
        </View>

        <View className="p-4 mt-3">

          <CalenderComponents ReserveDate={setSelectDate} />
          <Text className="font-Poppins-SemiBold mt-5" style={{ color: "#073064", fontSize: 16 }}>Available time</Text>
          {timeslot.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ paddingTop: 10 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {timeslot?.map((slot, index) => (
                <TouchableOpacity
                  className="mr-2 flex-row items-center p-2 rounded-md space-x-2 "
                  onPress={() => handleTimeSlotPress(slot)}
                  key={index}
                  style={[
                    styles.timeSlot,
                    { backgroundColor: slot === selectedSlot ? '#073064' : 'white' },
                  ]}
                >
                  <Text className="font-Poppins-Bold " style={{ color: slot === selectedSlot ? 'white' : 'black', fontSize: 12 }}>{slot}</Text>
                </TouchableOpacity>
              ))}


            </ScrollView>) : (
            <Text className="pt-3 text-center font-Poppins-Light">No slots available</Text>
          )}
          <View className="mt-4">
            <View className="flex-row m-1 justify-between items-center">
            <View className="space-y-2 ">
              <Text className="font-Poppins-SemiBold " style={{ color: "#073064", fontSize: 16 }}>Guest</Text>
              <View className="bg-white flex-row items-center justify-between p-1 rounded-lg" style={{ width: 115 }}>
                <TouchableOpacity onPress={decrementCount}>
                  <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, backgroundColor: "#FDE5E4", color: "#DC4A45" }}>-</Text>
                  {/* <Image source={require('../assets/minas.png')} style={{ width: 30, height: 30 }} /> */}
                </TouchableOpacity>
                <Text className="font-medium text-md" style={{ fontFamily: "Medium" }}>{count}</Text>
                <TouchableOpacity onPress={incrementCount}>
                  <Text className=" rounded-md text-center font-Poppins-Bold" style={{ width: 30, backgroundColor: "#DAE0E8", color: "#073064" }}>+</Text>
                  {/* <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30 }} /> */}
                </TouchableOpacity>
              </View>
            </View>
            <View className="space-y-2 ">
              <Text className="font-Poppins-SemiBold mb-2" style={{ color: "#073064", fontSize: 16 }}>Seating Type</Text>
              <CustomSelectList
                options={positions}
                selectedValue={selectedOption}
                onValueChange={setSelectedOption}
                placeholder="Select"
              />

            </View></View>
            {ConfirmLoading ? <View className="w-full flex-row justify-center mt-3"><Text ><ActivityIndicator className="mt-2" size={24} color="#073064" /> </Text></View> : <TouchableOpacity className="mt-4 mb-3" style={[styles.getStartedButton, { opacity: selectedSlot && timeslot.length > 0 ? 1 : 0.5 }]} onPress={handleUpdateReservePress} disabled={timeslot.length === 0 && selectedSlot} >
              <Text style={styles.buttonText}>Reserve Update Now</Text>
            </TouchableOpacity>}


          </View>
        </View>

      </ScrollView>}

    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 21,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0E0E0E',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#B5B5B5',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#073064',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: '#073064',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ReservationEdit