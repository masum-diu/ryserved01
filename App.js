// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './src/navigation/BottomNavigation';
import CategoryPageScreen from './src/screens/CategoryPage';


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} options={{ freezeOnBlur: true }}>
      <Stack.Screen name="Home" component={BottomNavigation} />
      <Stack.Screen name="CategoryPage" component={CategoryPageScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}