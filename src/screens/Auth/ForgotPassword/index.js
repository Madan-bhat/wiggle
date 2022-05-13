import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { width } from '../../../constants';
import { DecryptData } from '../../../functions';
import { Alert } from 'react-native-windows';

const ForgotPassword = ({ route, navigation }) => {
  let [email, setEmail] = useState('');
  const actionCodeSettings = {
    handleCodeInApp: true,
    // URL must be whitelisted in the Firebase Console.
    url: 'https://photogram-chat-7e841.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
    android: {
      packageName: 'com.wiggle',
    },
  };
  const sendEmail = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(_data => ToastAndroid.show('Password reset email sent', 12))
      .catch(e => {
        console.log(e);
        Alert.alert(e.message);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontFamily: 'Lato-Bold',
          fontSize: 32,
          textAlign: 'center',
          marginHorizontal: 6,
          marginVertical: 24,
        }}>
        {'Please enter the Email'}
      </Text>
      <TextInput
        keyboardType="email-address"
        placeholder="Email"
        style={{
          width: width - 24,
          backgroundColor: '#fff',
          fontSize: 18,
          fontFamily: 'Lato-Regular',
          fontWeight: 'bold',
        }}
        textAlign={'center'}
        onChangeText={_val => {
          setEmail(_val);
        }}
      />
      <TouchableOpacity
        disabled={email.replace(/\s/g, '').length === 0 ? true : false}
        style={{ marginTop: 18 }}
        onPress={() => sendEmail()}>
        <ImageBackground
          imageStyle={{
            borderRadius: 10,
          }}
          source={require('../../../../assets/Dania.jpg')}
          style={styles.panelButton}>
          <View style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Send Link</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

let styles = StyleSheet.create({
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: '#fff',
  },
  panelSubtitle: {
    fontSize: 14,
    color: '#fff',

    height: 30,
    marginBottom: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  panelButton: {
    padding: 8,
    width: width - 24,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 8,
  },
});

export default ForgotPassword;
