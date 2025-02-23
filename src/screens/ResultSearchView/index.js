import {
    ActivityIndicator,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../util/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import instance from '../../api/api_instance';
import { useNavigation } from '@react-navigation/native';
navigator.geolocation = require('react-native-geolocation-service');

async function requestLocationPermission() {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Access Required",
                    message: "This app needs to access your location",
                    buttonPositive: "OK",
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn("Location permission denied");
            }
        }
    } catch (err) {
        console.warn(err);
    }
}

const RECENT_LOCATIONS_KEY = 'recent_locations';
const RECENT_VIEW_KEY = 'recent_view';

const ResultSearchView = () => {
    const { width } = Dimensions.get('window');
    const { setUserAreaLocation } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    const [recentLocations, setRecentLocations] = useState([]);
    const [recentResturants, setRecentResturants] = useState([]);
    const [isTyping, setIsTyping] = useState(false); // To track if user is typing
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    // Load recent locations from AsyncStorage on mount ashita bar
    useEffect(() => {
        requestLocationPermission();
        loadRecentLocations();
        loadRecentResturants();
    }, []);

    // Function to load recent locations from AsyncStorage
    const loadRecentLocations = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
            if (storedLocations) {
                setRecentLocations(JSON.parse(storedLocations));
            }
        } catch (error) {
            console.warn('Error loading recent locations:', error);
        }
    };


    // Function to save recent locations to AsyncStorage
    const saveRecentLocations = async (locations) => {
        try {
            await AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(locations));
        } catch (error) {
            console.warn('Error saving recent locations:', error);
        }
    };
    const saveRecentRestruant = async (address, navigation) => {
        const storeData = {
            id: address.id,
            image: address.images[0].link,
            listingName: address.listingName,
            area: address.branches[0].area,
            city: address.branches[0].city,
        };

        try {
            // Get current data from AsyncStorage
            const existingData = await AsyncStorage.getItem(RECENT_VIEW_KEY);
            const parsedData = existingData ? JSON.parse(existingData) : [];

            // Check if the restaurant already exists in the list
            const isAlreadyInList = parsedData.some(item => item.id === storeData.id);

            if (!isAlreadyInList) {
                // Add the new restaurant data if it doesn't already exist
                parsedData.unshift(storeData);

                // Keep only the last 3 items
                if (parsedData.length > 3) {
                    parsedData.pop(); // Remove the oldest item if more than 3
                }

                // Save the updated data
                await AsyncStorage.setItem(RECENT_VIEW_KEY, JSON.stringify(parsedData));
            }

            // Navigate to the ViewRestaurant screen and pass the id

        } catch (error) {
            console.warn('Error saving recent locations:', error);
        }
    };



    const loadRecentResturants = async () => {
        try {
            const storedResturants = await AsyncStorage.getItem(RECENT_VIEW_KEY);
            if (storedResturants) {
                setRecentResturants(JSON.parse(storedResturants));
            }
        } catch (error) {
            console.warn('Error loading recent locations:', error);
        }
    };
    const fetchDataSearch = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/RESTAURANT/search?byName=${searchText}&pageNo=1&perPage=7
`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setSliderData(response?.data?.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDataSearch()
    }, [searchText]);
    const handleSelectLocation = (data) => {
        const locationName = data?.structured_formatting?.main_text;
        setUserAreaLocation(locationName);
        navigation.navigate('Home', { screen: 'Search' });

        // Update recent locations state and persist to AsyncStorage
        setRecentLocations((prev) => {
            const updatedLocations = [locationName, ...prev.filter((loc) => loc !== locationName)].slice(0, 5); // Keep only unique and last 5
            saveRecentLocations(updatedLocations);
            return updatedLocations;
        });
    };

    return (
        <View className="p-4 flex-1" style={{ backgroundColor: '#E6EAF0' }}>
            <View className="flex-row justify-between items-center mb-3">
                <TouchableOpacity className="bg-white h-8 w-8 flex-row items-center justify-center rounded-md" style={{ borderColor: '#DBDBDB', borderWidth: 1 }} onPress={() => navigation.goBack()} >
                    <Ionicons name="chevron-back-outline" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Search' })}>
                    <Text className="font-Poppins-SemiBold " style={{color:"#073064"}}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: 4,
                    borderColor: '#DBDBDB',
                    borderWidth: 1,
                    height: 40,
                }}
                className="flex-row px-2 items-center mb-2"
            >
                <Ionicons name="search-outline" size={20} style={{ color: '#B5B5B5' }} />
                <TextInput
                    placeholder="Search for places, foods, and special days"
                    className="font-Poppins-Light flex-1"
                    style={{ fontSize: 12 }}
                    onFocus={() => {
                        setIsTextInputFocused(true);
                        setIsTyping(false); // Reset isTyping when focus is on input
                    }}
                    onBlur={() => setIsTextInputFocused(false)}
                    onChangeText={(text) => {
                        setIsTyping(text.length > 0); // Set isTyping to true if there's any text
                        // You can also store the typed text if needed
                        setSearchText(text);  // Assuming you have a state like setSearchText
                    }}
                />

            </View>

            {/* GooglePlacesAutocomplete */}
            <GooglePlacesAutocomplete
                placeholder="Location"
                onPress={(data) => handleSelectLocation(data)}
                fetchDetails={true}
                query={{
                    key: 'AIzaSyBrBx53iu0KnL2hrU5sL9-OzpjTQ6NkKRo',
                    language: 'en',
                }}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'white',
                        borderRadius: 4,
                        borderColor: '#DBDBDB',
                        borderWidth: 1,
                    },
                    textInput: {
                        height: 32,
                        color: '#5d5d5d',
                        fontSize: 14,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                }}
                textInputProps={{
                    onFocus: () => {
                        setIsTextInputFocused(false); // Focus on this disables recent location list
                        setIsTyping(false); // Reset typing flag
                    },
                    onChangeText: (text) => setIsTyping(text.length > 0),
                }}
            />

            {/* Recent Locations or Recently Viewed */}
            {!isTyping && !searchText && (
                <View className="absolute left-4 top-40">
                    {recentLocations?.length > 0 && (
                        <Text className="font-Poppins-SemiBold mb-2">
                            {isTextInputFocused ? 'Recently viewed' : 'Recent locations'}
                        </Text>
                    )}
                    <View style={{ width: width * 0.92 }}>
                        {!isTextInputFocused ? recentLocations?.map((location, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#D9D9D9',
                                    paddingVertical: 10,
                                }}
                                onPress={() => {
                                    setUserAreaLocation(location);
                                    navigation.navigate('Home', { screen: 'Search' });
                                }}
                            >
                                <Text className="font-Poppins-Medium text-xs">{location}</Text>
                            </TouchableOpacity>

                        )) : loading ? <ActivityIndicator size="small" color="#0000ff" /> :
                            <View style={{ width: width * 0.92 }}>
                                {recentResturants?.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#D9D9D9',
                                            paddingVertical: 10,
                                        }}
                                        onPress={() => {
                                            saveRecentRestruant(item);
                                            const id = item?.id
                                            navigation.navigate("ViewRestaurant", { id })
                                        }}
                                    >
                                        <View className="flex-row items-center justify-between space-x-3">

                                            <View className="flex-row items-center space-x-3 flex-grow">
                                                <Image
                                                    source={{ uri: item?.image }}
                                                    style={{ height: 50, width: 50, borderRadius: 4, resizeMode: 'cover' }}
                                                />
                                                <View>
                                                    <Text className="font-Poppins-SemiBold">{item?.listingName}</Text>
                                                    <Text className="font-Poppins-Regular text-xs">
                                                        {item?.area}, {item?.city}
                                                    </Text>
                                                </View>
                                            </View>

                                            <Ionicons name="chevron-forward-outline" color="#000" size={18} />
                                        </View>




                                    </TouchableOpacity>
                                ))}
                            </View>}

                    </View>
                </View>
            )}

            {!isTyping && searchText && (
                <View className="absolute left-4 top-40">
                    {loading && <ActivityIndicator size="small" color="#0000ff" />}
                    <View style={{ width: width * 0.92 }}>
                        {sliderData?.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#D9D9D9',
                                    paddingVertical: 10,
                                }}
                                onPress={() => {
                                    saveRecentRestruant(item);
                                    const id = item?.id
                                    navigation.navigate("ViewRestaurant", { id })
                                }}
                            >
                                <View className="flex-row items-center justify-between space-x-3">
                                    {/* Image and Text */}
                                    <View className="flex-row items-center space-x-3 flex-grow">
                                        <Image
                                            source={{ uri: item?.images[0]?.link }}
                                            style={{ height: 50, width: 50, borderRadius: 4, resizeMode: 'cover' }}
                                        />
                                        <View>
                                            <Text className="font-Poppins-SemiBold">{item?.listingName}</Text>
                                            <Text className="font-Poppins-Regular text-xs">
                                                {item?.branches[0]?.area || 'N/A'}, {item?.branches[0]?.city || 'N/A'}
                                            </Text>

                                        </View>
                                    </View>
                                    {/* Icon */}
                                    <Ionicons name="chevron-forward-outline" color="#000" size={18} />
                                </View>




                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}


        </View>
    );
};

export default ResultSearchView;
