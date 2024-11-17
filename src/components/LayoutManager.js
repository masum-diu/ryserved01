import React from 'react';
import { ScrollView, View } from 'react-native';
import PromotionalBanner from './PromotionalBanner';
import Slider from './Slider';
import BannerAds from './BannerAds';

const LayoutManager = ({ data }) => {
    
   const renderPatternComponent = (item) => {
       switch (item.pattern) {
           case 'promotional-banner':
               return <PromotionalBanner key={item.id} content={item.content} />;
           case 'slider':
               return <Slider key={item.id} title={item.title} subtitle={item.subtitle} />;
           case 'banner-ads':
               return <BannerAds key={item.id} content={item.content} />;
          
           default:
               return null;
       }
   };

   return (
       <ScrollView>
           {data.map((item) => (
               <View key={item.id}>{renderPatternComponent(item)}</View>
           ))}
       </ScrollView>
   );
};

export default LayoutManager;
