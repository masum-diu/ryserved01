// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './src/navigation/BottomNavigation';
import CategoryPageScreen from './src/screens/CategoryPage';
import ViewRestaurant from './src/screens/viewRestaurants';
import { AuthProvider } from './src/util/AuthContext';
import ReserveConfirm from './src/screens/ReserveConfirm';


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} options={{ freezeOnBlur: true }}>
      <Stack.Screen name="Home" component={BottomNavigation} />
      <Stack.Screen name="CategoryPage" component={CategoryPageScreen} />
      <Stack.Screen name="ViewRestaurant" component={ViewRestaurant} />
      <Stack.Screen name="ReserveConfirm" component={ReserveConfirm} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </NavigationContainer>
  );
}