import { View, Text, Button, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import CategoryCard from '../../components/CategoryCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import instance from '../../api/api_instance';
import AllRestaurantsListCard from '../../components/AllRestaurantsListCard';
import SearchResult from '../../components/SearchResult';
const SearchScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const { width, height } = Dimensions.get('window');
    const [expandedSection, setExpandedSection] = useState(null);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedSeating, setSelectedSeating,] = useState([]);
    const [sliderData, setSliderData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cuisineDataLists, setCuisineDataLists] = useState([]);
    const Seating = selectedSeating.join("_")
    const Cuisines = selectedCuisines.join("_")
    // console.log(Seating, Cuisines)
    const cuisineData = [
        { id: 2, name: 'Cuisine' },
        { id: 3, name: 'Reservation' },
        { id: 4, name: 'Seating' },
        { id: 5, name: 'Price' },
        { id: 6, name: 'Guest' },
    ];
    const SeatingData = [
        { id: 2, name: 'Standard' },
        { id: 3, name: 'Bar' },
        { id: 4, name: 'Counter' },
        { id: 5, name: 'Hightop' },
        { id: 6, name: 'Outdoor' },
        { id: 7, name: 'Corner' },
    ];


    const fetchDatacuisine = async () => {
        try {
            setLoading(true);
            const response = await instance.get('/cuisine', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data) {
                setCuisineDataLists(response?.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    const fetchDataSearch = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/RESTAURANT/search?cuisine=${Cuisines}&date=${selectedDate}&pageNo=1&perPage=50
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
        fetchDatacuisine();
    }, []);
    // Function to handle cuisine selection
    const handleCategoryPress = useCallback((name) => {
        setExpandedSection((prevSection) => (prevSection === name ? null : name));
    }, []);

    // Function to clear selected date
    const clearSelection1 = () => {
        setSelectedDate('');
    };

    const handleCuisineSelect = (cuisine) => {
        if (selectedCuisines.includes(cuisine)) {
            setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine)); // Deselect
        } else {
            setSelectedCuisines([...selectedCuisines, cuisine]); // Select
        }
    };
    const handleSeatingSelect = (cuisine) => {
        if (selectedSeating.includes(cuisine)) {
            setSelectedSeating(selectedSeating.filter((item) => item !== cuisine)); // Deselect
        } else {
            setSelectedSeating([...selectedSeating, cuisine]); // Select
        }
    };

    // Clear all selections
    const clearSelection = () => {
        setSelectedCuisines([]);
    };
    Geolocation.getCurrentPosition();

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: "#E6EAF0" }}>
            <View className="p-4" >

                <TouchableOpacity >
                    <View
                        className="flex-row justify-between items-center  mb-3 px-2"
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 6,
                            borderColor: '#DBDBDB',
                            borderWidth: 1,
                            height: 40,
                        }}
                    >
                        <View className="flex-row items-center space-x-3">
                            <Ionicons name="search-outline" size={20} style={{ color: '#B5B5B5' }} />
                            <Text className="font-Poppins-Regular" style={{ color: "#B5B5B5" }}>Search for restaurant </Text>
                        </View>
                        <TouchableOpacity className="p-1" style={{ borderWidth: 1, borderColor: "white", borderRadius: 4 }} >
                            <Ionicons name="map-outline" size={18} style={{ color: '#073064' }} />
                        </TouchableOpacity>

                    </View>
                </TouchableOpacity>

                <FlatList
                    data={cuisineData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCategoryPress(item.name)} className="mr-2 flex-row items-center p-2 mb-2 " style={{ backgroundColor: expandedSection === item.name ? '#073064' : '#FFFF', borderRadius: 4, borderWidth: 1, borderColor: '#DBDBDB', height: 35 }}>
                            <Text className="font-Poppins-SemiBold text-xs" style={{ color: expandedSection === item.name ? "#ffff" : "#DBDBDB" }}>{item.name} </Text>
                        </TouchableOpacity>
                        // <CategoryCard
                        //     onPress={() => handleCategoryPress(item.name)}
                        //     title={item.name}
                        //     isSelected={expandedSection === item.name}
                        // />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />


                {/* Default message */}
                {/* {!expandedSection && (
                    <Text className="text-center text-gray-600 text-lg mt-4">
                        Find your restaurant
                    </Text>
                )} */}
                <ScrollView >
                    <SearchResult sliderData={sliderData} loading={loading} />
                </ScrollView>

                {/* Collapsible Section */}
                {expandedSection === 'Seating' && (
                    <View className="p-4 m-4 bg-white rounded-lg shadow absolute top-24 z-10 " style={{ width: width * 0.92 }}>
                        <View className="flex-row justify-between items-center mb-4 m-1">
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>
                                Seating
                            </Text>
                            <TouchableOpacity>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: '#f44336' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <ScrollView>
                            {SeatingData?.map((cuisine) => (
                                <TouchableOpacity
                                    key={cuisine.id}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: "space-between",
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        // borderBottomWidth: 1,
                                        borderBottomColor: '#B2BFCF',

                                    }}
                                    onPress={() => handleSeatingSelect(cuisine.name)}
                                >
                                    <Text
                                        className="font-Poppins-Medium"
                                        style={{
                                            fontSize: 14,
                                            color: '#000',
                                        }}
                                    >
                                        {cuisine.name}
                                    </Text>
                                    <Ionicons

                                        name={selectedSeating.includes(cuisine.name) ? 'checkbox' : 'square-outline'} // Check or uncheck icon
                                        size={24}
                                        color={selectedSeating.includes(cuisine.name) ? '#073064' : '#000'}
                                        style={{ marginRight: 10 }}
                                    />

                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View className="flex-row justify-between mt-4">

                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: '#073064',
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                }}

                            >
                                <Text className="font-Poppins-Regular" style={{ color: '#fff' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {expandedSection === 'Price' && (
                    <View className="p-4 m-4 bg-white rounded-lg shadow absolute top-24 z-10 " style={{ width: width * 0.92 }}>
                        <View className="flex-row justify-between items-center mb-4 m-1">
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>
                                Price
                            </Text>

                            <TouchableOpacity>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: '#f44336' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            className="py-4"
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {["৳", "৳৳", "৳৳৳", "৳৳৳৳", "৳৳৳৳৳"]?.map((item, index) => {
                                const isSelected = selectedItem === item;
                                return (
                                    <TouchableOpacity key={index}
                                        onPress={() => setSelectedItem(item)} className="mr-2 flex-row items-center p-2 space-x-2 mt-3 " style={{ backgroundColor: isSelected ? '#073064' : '#FFFF', borderColor: "#073064", borderWidth: 1, borderRadius: 4, }}>

                                        <Text className="font-Poppins-SemiBold text-xs" style={{ color: isSelected ? "#ffff" : "#073064" }}>{item} </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View className="flex-row justify-between mt-4">

                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: '#073064',
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                }}

                            >
                                <Text className="font-Poppins-Regular" style={{ color: '#fff' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {expandedSection === 'Guest' && (
                    <View className="p-4 m-4 bg-white rounded-lg shadow absolute top-24 z-10 " style={{ width: width * 0.92 }}>
                        <View className="flex-row justify-between items-center mb-4 m-1">
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>
                                Guest
                            </Text>
                            <TouchableOpacity>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: '#f44336' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>

                        </View>



                        <View className="flex-row justify-between mt-4">

                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: '#073064',
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                }}

                            >
                                <Text className="font-Poppins-Regular" style={{ color: '#fff' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {expandedSection === 'Cuisine' && (
                    <View className="p-4 m-4 bg-white rounded-lg shadow absolute top-24 z-10 " style={{ width: width * 0.92 }}>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>
                                Cuisine
                            </Text>
                            <TouchableOpacity onPress={clearSelection}>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: '#f44336' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cuisine Options */}
                        <ScrollView>
                            {cuisineDataLists?.map((cuisine) => (
                                <TouchableOpacity
                                    key={cuisine.id}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: "space-between",
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        // borderBottomWidth: 1,
                                        borderBottomColor: '#B2BFCF',

                                    }}
                                    onPress={() => handleCuisineSelect(cuisine.name)}
                                >
                                    <Text
                                        className="font-Poppins-Medium"
                                        style={{
                                            fontSize: 14,
                                            color: '#000',
                                        }}
                                    >
                                        {cuisine.name}
                                    </Text>
                                    <Ionicons

                                        name={selectedCuisines.includes(cuisine.name) ? 'checkbox' : 'square-outline'} // Check or uncheck icon
                                        size={24}
                                        color={selectedCuisines.includes(cuisine.name) ? '#073064' : '#000'}
                                        style={{ marginRight: 10 }}
                                    />

                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Apply Button */}
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                backgroundColor: '#073064',
                                borderRadius: 5,
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                            onPress={() => {
                                setExpandedSection(null);
                                fetchDataSearch();
                            }}

                        >
                            <Text className="font-Poppins-Regular" style={{ color: '#fff' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {expandedSection === 'Reservation' && (
                    <View className="p-4 m-4 bg-white rounded-lg shadow absolute top-24 z-10 " style={{ width: width * 0.92 }}>
                        <View className="flex-row justify-between items-center mb-4 m-1">
                            <Text className="font-Poppins-SemiBold" style={{ fontSize: 16 }}>
                                Reservation
                            </Text>
                            <TouchableOpacity>
                                <Text className="font-Poppins-Medium" style={{ fontSize: 14, color: '#f44336' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <Calendar
                            style={{ borderRadius: 10 }}
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    disableTouchEvent: true,
                                    selectedColor: '#073064', // Ensures background color is applied
                                    selectedTextColor: '#ffffff', // Ensures text is visible
                                },
                            }}
                            theme={{
                                selectedDayBackgroundColor: '#073064', // Matches markedDates' selectedColor
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#073064',
                                arrowColor: '#073064', // Optional: Customize arrow color
                                textDayFontWeight: 'font-Poppins-SemiBold', // Optional: Text styling
                                textMonthFontWeight: 'font-Poppins-SemiBold',
                                textDayHeaderFontWeight: 'font-Poppins-SemiBold',
                            }}
                        />

                        <View className="flex-row justify-between mt-4">

                            <TouchableOpacity
                                onPress={() => {
                                    setExpandedSection(null);
                                    fetchDataSearch();
                                }}

                                style={{
                                    padding: 10,
                                    backgroundColor: '#073064',
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                }}

                            >
                                <Text className="font-Poppins-Regular" style={{ color: '#fff' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;
