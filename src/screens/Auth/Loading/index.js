import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Text,
  Image,
} from 'react-native';
import { AuthContext } from '../../../context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator } from 'react-native-paper';
import { height, width } from '../../../constants';

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
    }, 2000);
  });
  return (
    <View
      style={{
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{ width: 280, height: 280 }}
        source={require('../../../../assets/chat.png')}
      />
    </View>
  );
}
