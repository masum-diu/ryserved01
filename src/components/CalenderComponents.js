import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CalendarStrip from 'react-native-calendar-strip'
import { useAuth } from '../util/AuthContext';

const CalenderComponents = ({ ReserveDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { setRealTimeUpdate } = useAuth()
  useEffect(() => {
    const timer = setTimeout(() => {
      ReserveDate(selectedDate);
      setRealTimeUpdate(selectedDate);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedDate]);
  const handleDateSelected = useCallback((date) => {
    setSelectedDate(new Date(date));
  }, []);

  const renderCustomHeader = () => {

    const monthYearString = selectedDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });



    // console.log(formattedDate); 
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text className="font-Poppins-SemiBold " style={{ color: "#073064", fontSize: 16 }}>{monthYearString}</Text>
      </View>
    );
  };
  return (

    <View >
      <View className="flex-row items-center justify-between mb-3" >
        {renderCustomHeader()}

      </View>
      <CalendarStrip
        scrollable

        calendarAnimation={{ type: 'sequence', duration: 30 }}
        daySelectionAnimation={{
          type: 'background',
          duration: 300,
          highlightColor: '#073064',

        }}
        style={{ height: 70 }}
        calendarColor={'#ffff'}
        calendarHeaderStyle={{ color: '#000', display: "none" }}
        dateNumberStyle={{ color: '#000' }}
        dateNameStyle={{ color: '#000' }}
        highlightDateNumberStyle={{ color: '#ffff', }}
        highlightDateNameStyle={{ color: '#ffff', }}
        iconContainer={{ flex: 0.1, }}
        selectedDate={selectedDate}
        onDateSelected={handleDateSelected}
        minDate={new Date()}

      />
    </View>
  )
}


export default CalenderComponents