import { View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import LayoutManager from '../../components/LayoutManager';
import { SafeAreaView } from 'react-native-safe-area-context';
import instance from '../../api/api_instance';

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/home-page?pageNo=1&perPage=10', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response?.data) {
        setHomeData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView  style={{ backgroundColor: '#E6EAF0' }}>
      <ScrollView bounces={false} overScrollMode="never" >
        <View>
          {/* Pass loading and data to LayoutManager */}
          <LayoutManager data={homeData} isLoading={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
