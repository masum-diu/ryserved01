import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (info) => {
                const { latitude, longitude } = info.coords;
                setUserLocation({ latitude, longitude });
            },
            (error) => {
                setError(error.message);
            },
           
        );
    }, []);
    const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        // Convert distance to meters if the unit is 'm'
        if (unit === 'm') {
            distance *= 1000;
        }

        return distance.toFixed(2); // Distance rounded to 2 decimal places

    };
    return { userLocation, error ,calculateDistance};
};

export default useUserLocation;
