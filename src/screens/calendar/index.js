import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../api/api_instance';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReserveCard from '../../components/ReserveCard';
import SwipingCardReservation from '../../components/SwipingCardReservation';
import EventCard from '../../components/EventCard';

const ReserveScreen = () => {
  const [userData, setUserData] = useState([]);
  const [userDataEvent, setUserDataEvent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Reservation');
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const fetchData = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before fetching data

      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const response = await instance.get(`/booking?from=0&to=8`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response?.data) {
          setUserData(response?.data);
        }
        else {
          setUserData([])
        }
      }

      setIsLoading(false); // Set isLoading back to false after fetching data
    } catch (error) {
      setIsLoading(false); // Make sure to set isLoading to false even if there's an error
      console.error('Error fetching user data:', error);
    }
  };
  const fetchDataEvent = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before fetching data

      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const response = await instance.get(`/event/booking?pageNo=1&perPage=8`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response?.data) {
          setUserDataEvent(response?.data);
        }
        else {
          setUserDataEvent([])
        }
      }

      setIsLoading(false); // Set isLoading back to false after fetching data
    } catch (error) {
      setIsLoading(false); // Make sure to set isLoading to false even if there's an error
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchDataEvent();
  }, [isFocused, selectedCategory]); // Fetch data when the screen gains focus
  const handleCategoryPress = (category) => {
    // Toggle the selected category
    setSelectedCategory(selectedCategory === category ? category : category);
    fetchData(category);
  };
  return (

    <SafeAreaView  style={{ flex: 1, backgroundColor: '#E6EAF0', }}>
      <View className="flex-row justify-center items-center m-4 p-1" style={{ backgroundColor: "#DBDBDB", borderRadius: 4 }}>
        <SwipingCardReservation
          onPress={() => handleCategoryPress('Reservation')}
          title="Reservation"
          isSelected={selectedCategory === 'Reservation'}
        />
        <SwipingCardReservation
          onPress={() => handleCategoryPress('Events')}
          title="Events"
          isSelected={selectedCategory === 'Events'}
        />
      </View>
      {selectedCategory && (
        <View  className="mb-36">
          {selectedCategory === 'Reservation' && (
            isLoading ?
              <View className="h-full flex-row justify-center items-center">
                <ActivityIndicator className="mt-2" size={24} color="#073064" />
              </View>
              : <ScrollView >
                <View >
                  {userData?.length > 0 ? (
                    userData.map((item, index) => {
                      // console.log(item)
                      //   if (!item.asset.geoTag || typeof item.asset.geoTag !== 'string') {
                      //     return null; // Skip rendering this item if geoTag is missing or not a string
                      //   }

                      //   const [latitude, longitude] = item.asset.geoTag.split(',');

                      //   const distance = userLocation
                      //     ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(latitude), parseFloat(longitude))
                      //     : null;
                      //   const distanceText = distance ? `${distance} km` : 'Unknown';

                      //   const distanceInMeters = distance ? parseFloat(distance) < 1 ? `${Math.round(parseFloat(distance) * 1000)} m` : distanceText : 'Unknown';
                      return (
                        <View>

                          <ReserveCard
                            key={index}
                            id={item?.id}
                            status={item.status}
                            resID={item?.propertyId}
                            imgUrl={item?.branch?.images[0]?.link}
                            title={item?.property?.listingName}
                            subTitle={item?.property?.subTitle}
                            rating={4.5}
                            genre="Japan"
                            address={Array.isArray(item?.branch) ? item?.branch[0]?.area : item?.branch?.area}
                            short_descr="this is a test descr"
                            dishes={[]}
                            long={20}
                            lat={0}
                            date={formatDate(item?.startDate)}
                            time={item?.slot}
                            guest={item?.guestNumber}
                          //   distance={distanceInMeters}
                          />
                        </View>

                      );
                    })
                  ) : (
                    <Text className="font-Poppins-Regular" style={{ textAlign: 'center', marginTop: 10 }}>{isLoading ? 'Loading...' : 'No data Available'}</Text>
                  )}
                </View>
              </ScrollView>
          )}

          {selectedCategory === 'Events' && (
            isLoading ?
            <View className="h-full flex-row justify-center items-center">
              <ActivityIndicator className="mt-2" size={24} color="#073064" />
            </View>
            : <ScrollView>
              <View >
                {userDataEvent?.length > 0 ? (
                  userDataEvent.map((item, index) => {
                    // console.log(item)
                    //   if (!item.asset.geoTag || typeof item.asset.geoTag !== 'string') {
                    //     return null; // Skip rendering this item if geoTag is missing or not a string
                    //   }

                    //   const [latitude, longitude] = item.asset.geoTag.split(',');

                    //   const distance = userLocation
                    //     ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(latitude), parseFloat(longitude))
                    //     : null;
                    //   const distanceText = distance ? `${distance} km` : 'Unknown';

                    //   const distanceInMeters = distance ? parseFloat(distance) < 1 ? `${Math.round(parseFloat(distance) * 1000)} m` : distanceText : 'Unknown';
                    return (
                      <View>

                        <EventCard
                          key={item?.id}
                          id={item?.id}
                          status={item.status}
                          resID={item?.propertyId}
                          imgUrl={item?.event?.images[0]}
                          title={item?.event?.evtName}
                          subTitle={item?.event?.subtitle}
                          rating={4.5}
                          genre="Japan"
                          address={item?.event?.location}
                          short_descr="this is a test descr"
                          dishes={[]}
                          long={20}
                          lat={0}
                          // date={formatDate(item?.eventDate)}
                          time={item?.slot}
                          guest={item?.person}
                        //   distance={distanceInMeters}
                        />
                      </View>

                    );
                  })
                ) : (
                  <Text className="font-Poppins-Regular" style={{ textAlign: 'center', marginTop: 10 }}>{isLoading ? 'Loading...' : 'No data Available'}</Text>
                )}
              </View>
            </ScrollView>


          )}

        </View>
      )}



    </SafeAreaView>

  )
};
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
const styles = StyleSheet.create({
  container: {

  },

});
export default ReserveScreen