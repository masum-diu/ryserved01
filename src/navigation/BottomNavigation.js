import React from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from '../screens/home';
import SearchScreen from '../screens/search';
import ReserveScreen from '../screens/calendar';
import SaveScreen from '../screens/save';
import ProfileScreen from '../screens/grid';

const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { width, height } = Dimensions.get('window');

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
              <View className="space-x-1" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'book-outline' : 'book-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Search' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'search-outline' : 'search-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Reservation' ? (
              <View className="space-x-1" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'calendar-outline' : 'calendar-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'Saved' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'bookmark-outline' : 'bookmark-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : route.name === 'More' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={isFocused ? 'grid-outline' : 'grid-outline'}
                  size={20}
                  color={iconColor}
                />
                {isFocused && <Text className="font-bold" style={{ color: iconColor, marginLeft: 4, fontSize: 12 }}>{label}</Text>}
              </View>
            ) : null}
          </Pressable>
        );
      })}
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
    // width: "98%",
    alignSelf: "center",
    bottom: 0,
     borderRadius: 12,
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
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default BottomNavigation;