// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './src/navigation/BottomNavigation';
import CategoryPageScreen from './src/screens/CategoryPage';
import ViewRestaurant from './src/screens/viewRestaurants';
import { AuthProvider } from './src/util/AuthContext';
import ReserveConfirm from './src/screens/ReserveConfirm';
import ModifyReservation from './src/screens/ModifyReservation';
import CancelReservation from './src/screens/CancelReservation';
import ReservationEdit from './src/screens/ReservationEdit';
import ViewEvent from './src/screens/ViewEvent';


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} options={{ freezeOnBlur: true }}>
      <Stack.Screen name="Home" component={BottomNavigation} />
      <Stack.Screen name="CategoryPage" component={CategoryPageScreen} />
      <Stack.Screen name="ViewRestaurant" component={ViewRestaurant} />
      <Stack.Screen name="ReserveConfirm" component={ReserveConfirm} />
      <Stack.Screen name="ModifyReservation" component={ModifyReservation} />
      <Stack.Screen name="CancelReservation" component={CancelReservation} />
      <Stack.Screen name="ReservationEdit" component={ReservationEdit} />
      <Stack.Screen name="ViewEvent" component={ViewEvent} />
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