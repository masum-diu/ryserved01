// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userDataUpdate, setUserDataUpdate] = useState(null)
    const [userDataUpdate1, setUserDataUpdate1] = useState(null)
    const [subID, setSubID] = useState(null)
    const [userAreaLocation, setUserAreaLocation] = useState(null)
    const [realTimeUpdate, setRealTimeUpdate] = useState(null);
    const navigation = useNavigation()
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const storedToken = await AsyncStorage.getItem('token');
    //             if (storedToken) {
    //                 setToken(storedToken);
    //             }
    //         } catch (error) {
    //             // console.error('Error fetching user data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // const signIn = async (token) => {
    //     try {
    //         await AsyncStorage.setItem('token', token);
    //         setToken(token);
    //     } catch (error) {
    //         // console.error('Error saving token:', error);
    //     }
    // };

    // const signOut = async () => {
    //     try {
    //         await AsyncStorage.removeItem('token')
    //         setToken(null)
    //         // navigation.navigate('Signin');
    //     } catch (error) {
    //         // console.error('Error saving token:', error);
    //     }

    // };

    return (
        <AuthContext.Provider value={{ token, setUserDataUpdate, userDataUpdate, userAreaLocation, setUserAreaLocation, userDataUpdate1, setUserDataUpdate1, subID, setSubID, realTimeUpdate, setRealTimeUpdate }}>
            {children}
        </AuthContext.Provider>
    );
};
