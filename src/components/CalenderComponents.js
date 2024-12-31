import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CalendarStrip from 'react-native-calendar-strip'
import { useAuth } from '../util/AuthContext';
import moment from 'moment';

const CalenderComponents = ({ ReserveDate }) => {
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  // const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { setRealTimeUpdate } = useAuth()
  const days = Array.from({ length: 365 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  );
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

    // const monthYearString = selectedDate.toLocaleString('en-US', {
    //   month: 'long',
    //   year: 'numeric',
    // });
    const monthYearString = moment(selectedDate).format('MMMM YYYY');

// console.log(monthYearString)

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
      <View className="bg-white flex-row justify-center items-center" >
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDate(new Date(item))}
            style={{
              alignItems: 'center',
              padding: 10,
              margin: 5,
              borderRadius: 5,
              backgroundColor:
                item === moment(selectedDate).format('YYYY-MM-DD')
                  ? '#073064'
                  : '#fff',
            }}
          >
            {/* Month */}
            <Text
            className="font-Poppins-Bold"
              style={{
                color:
                  item === moment(selectedDate).format('YYYY-MM-DD')
                    ? '#fff'
                    : '#000',
                fontSize: 12,
               
              }}
            >
              {moment(item).format('ddd')}
            </Text>
            {/* Day */}
            <Text
             className="font-Poppins-SemiBold"
              style={{
                color:
                  item === moment(selectedDate).format('YYYY-MM-DD')
                    ? '#fff'
                    : '#000',
                fontSize: 18,
              }}
            >
              {moment(item).format('DD')}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>

      {/* <CalendarStrip
        scrollable

        calendarAnimation={{ type: 'sequence', duration: 100 }}
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

      /> */}
    </View>
  )
}


export default CalenderComponents