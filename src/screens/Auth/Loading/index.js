import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';
import { AuthContext } from '../../../context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export default function Loading({ navigation }) {
  const [fcm, setFcm] = useState('');
  let user = useContext(AuthContext);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED || result === true;
    }
    return true;
  };
  useEffect(() => {
    requestPermissions();
    setTimeout(() => {
      auth().onAuthStateChanged(user => {
        if (user) {
          messaging()
            .getToken()
            .then(fcm => setFcm(fcm));
          firestore().collection('users').doc(auth().currentUser.uid).update({
            token: fcm,
          });
          navigation.navigate('photogram.dashboard.screen');
        } else {
          navigation.navigate('photogram.login.screen');
        }
      });
    }, 1000);
  });
  return (
    <ImageBackground
      source={require('../../../../assets/background.png')}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color='="#fff' size={24} />
    </ImageBackground>
  );
}
