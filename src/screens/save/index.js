import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BookMarkSave from '../../components/BookMarkSave';
import instance from '../../api/api_instance';

const SavedScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, [isFocused]);


  const fetchData = async () => {
    try {
      setIsLoading(true);

      const storedToken = await AsyncStorage.getItem('token');
      //  console.log(storedToken)
      if (storedToken) {
        const response = await instance.get(`/wishlist`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response?.data) {

          setUserData(response?.data);
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user data:', error);
    }
  };

  const deleteWishlistItem = async () => {
    try {
      setIsLoading(true);

      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken && selectedItemId) {
        const response = await instance.delete(`/wishlist/${selectedItemId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response?.status === 200) {
          setUserData((prevUserData) => prevUserData.filter(item => item.id !== selectedItemId));
          // console.log('Item deleted successfully'); 
        } else {
          console.error('Failed to delete the item:', response);
        }
      } else {
        console.error('Stored token is undefined or null.');
      }

      setIsLoading(false);
      setShowConfirmModal(false); // Close the modal after deletion
    } catch (error) {
      setIsLoading(false);
      console.error('Error deleting wishlist item:', error);
    }
  };

  const handleDeletePress = (itemId) => {
    setSelectedItemId(itemId); // Set the item ID to be deleted
    setShowConfirmModal(true); // Show the confirmation modal
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E6EAF0' }}>
      {isLoading ? (
        <View className=" flex-row justify-center items-center">
          <ActivityIndicator className="mt-2" size={24} color="#073064" />
        </View>
      ) : (
        <ScrollView className="mb-16" >
          <View  >
            {userData?.length > 0 ? (
              userData.map((item, index) => {
                // if (!item.asset.geoTag || typeof item.asset.geoTag !== 'string') {
                //   return null; // Skip rendering this item if geoTag is missing or not a string
                // }

                // const [latitude, longitude] = item.asset.geoTag.split(',');

                // const distance = userLocation
                //   ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(latitude), parseFloat(longitude))
                //   : null;
                // const distanceText = distance ? `${distance} km` : 'Unknown';

                // const distanceInMeters = distance
                //   ? parseFloat(distance) < 1
                //     ? `${Math.round(parseFloat(distance) * 1000)} m`
                //     : distanceText
                //   : 'Unknown';

                return (
                  <BookMarkSave
                    key={index}
                    id={item?.id}
                    imgUrl={item?.images[0]?.link}
                    title={item?.listingName}
                    subTitle={item?.subTitle}
                    onDelete={() => handleDeletePress(item?.id)}
                  />
                );
              })
            ) : (
              <Text className="font-Poppins-Light" style={{ textAlign: 'center', marginTop: 10 }}>
                {isLoading ? 'Loading...' : 'No data Available'}
              </Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className="font-Poppins-SemiBold" style={{ textAlign: "center", color: "#073064", fontSize: 22 }}>
              Confirm Remove
            </Text>
            <Text className="font-Poppins-Light" style={{ textAlign: "center", color: "#979797", fontSize: 14, marginVertical: 10 }}>
              Are you sure you want to Remove this item?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.noButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="font-Poppins-SemiBold" style={styles.noButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={deleteWishlistItem}
              >
                <Text className="font-Poppins-SemiBold" style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  noButton: {
    borderWidth: 1,
    borderColor: '#073064',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  yesButton: {
    backgroundColor: '#073064',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  noButtonText: {
    color: '#073064',
  },
  yesButtonText: {
    color: 'white',

  },
});

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;

  if (unit === 'm') {
    distance *= 1000;
  }

  return distance.toFixed(2);
};

export default SavedScreen;
