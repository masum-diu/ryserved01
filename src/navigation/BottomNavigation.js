import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from '../screens/home';
import SearchScreen from '../screens/search';
import ReserveScreen from '../screens/calendar';
import SaveScreen from '../screens/save';
import ProfileScreen from '../screens/Profile';
import CustomModal from '../components/CustomModal';
const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";
const { width } = Dimensions.get('window');

// Define responsive padding/margins
// const tabItemPadding = width > 400 ? 20 : 10;
// const tabItemMargin = width > 400 ? 12 : 8
function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const authCheck = async () => {
  //   const token = await AsyncStorage.getItem('token');
  //   return token !== null && token !== undefined;
  // };

  const handleMoreTabPress = async () => {
    setIsModalVisible(true);
    // const isAuthenticated = await authCheck();
    // if (isAuthenticated) {
    //   navigation.navigate('More');
    // } else {
      
    // }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        // Set background color based on whether tab is focused
        let tabBackgroundColor = isFocused ? "#073064" : "transparent";

        // Set icon color based on whether tab is focused
        let iconColor = isFocused ? '#FFFF' : '#B2BFCF';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
            // if (route.name === 'More') {
            //   handleMoreTabPress();
            // } else {
              
            // }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? "#073064" : "transparent" },
            ]}
          >
            {route.name === 'Explore' ? (
              <View className="space-x-2" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'book-outline' : 'book-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Search' ? (
              <View className="space-x-2" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'search' : 'search'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-Poppins-Bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Reservation' ? (
              <View className="space-x-2" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'calendar-outline' : 'calendar-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-Poppins-Bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Saved' ? (
              <View className="space-x-2" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'bookmark-outline' : 'bookmark-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-Poppins-Bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'More' ? (
              <View className="space-x-2" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'grid-outline' : 'grid-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-Poppins-Bold" style={{ color: iconColor, marginLeft: 4, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : null}
          </Pressable>
        );
      })}
       <CustomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Reservation"
        component={ReserveScreen}
        options={{
          tabBarLabel: 'Reservation',
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SaveScreen}
        options={{
          tabBarLabel: 'Saved',
        }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    boxShadow: '4px 0px 10px 0px #05050533',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#073064",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 36,
    //  paddingHorizontal: 20,

     paddingHorizontal: 10,
    borderRadius: 6,
     marginHorizontal: 10,
    marginHorizontal: 10
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default BottomNavigation;
