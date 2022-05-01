import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import AuthContext from '../../../context/AuthContext/index';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import {height, width} from '../../../constants';
export default function Register({navigation}) {
  let [email, setEmail] = useState('');
  let [userName, setUserName] = useState('');
  let [password, setPassword] = useState('');
  let [isKeyboardShown, setKeyboardshowed] = useState(false);
  let [isFocused, setFocused] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardshowed(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardshowed(false);
    });
  });

  const RegisterWithEmailAndPassword = () => {
    try {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          firestore().collection('users').doc(user.user.uid).set({
            uid: user.user.uid,
            userName,
            email,
            groups: [],
            createdAt: Date.now(),
            userImg: '',
            token: '',
          });
        })
        .catch(e => {
          Alert.alert(e?.message);
        });
    } catch (error) {}
  };

  const styles = StyleSheet.create({
    Container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    RegisterFormContainer: {
      height: height / 2.5,
      shadowColor: '#000000',
      elevation: 18,
      backgroundColor: '#fff',
      width: width / 1 - 48,
    },
    title: {
      marginHorizontal: 26,
      fontSize: 24,
      marginTop: 28,
      marginBottom: 14,
      fontWeight: 'bold',
    },
    UsernameInput: {
      padding: 8,
      fontSize: 16,
      color: '#000000',
      fontWeight: 'bold',
      marginHorizontal: 24,
      borderBottomColor: isFocused === 'Username' ? '#45A4FF' : '#000',
      borderBottomWidth: isFocused === 'Username' ? 2 : 0.5,
    },
    EmailInput: {
      padding: 8,
      marginTop: 12,
      fontSize: 16,
      color: '#000000',
      fontWeight: 'bold',
      marginHorizontal: 24,
      borderBottomColor: isFocused === 'Email' ? '#45A4FF' : '#000',
      borderBottomWidth: isFocused === 'Email' ? 2 : 0.5,
    },
    PassowrdInput: {
      color: '#000000',
      fontSize: 16,
      padding: 8,
      fontWeight: 'bold',
      marginHorizontal: 24,
      marginTop: 12,
      borderBottomColor: isFocused === 'Password' ? '#45A4FF' : '#000',
      borderBottomWidth: isFocused === 'Password' ? 2 : 0.5,
    },
    RegisterButtonContainer: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      marginTop: 12,
    },
    RegisterButton: {
      padding: 18,
      backgroundColor: '#45A4FF',
      marginTop: 12,
      display: 'flex',
      left: 0,
      marginRight: width / 4,
      borderRadius: 6,
      paddingLeft: 34,
      paddingRight: 34,
      alignSelf: 'flex-end',
      shadowColor: '#000',
      elevation: 8,
    },
    RegisterButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    ForgotPasswordText: {
      marginHorizontal: width / 3.7,
      textAlign: 'left',
      color: '#45A4FF',
      fontSize: 17,
      fontWeight: 'bold',
      marginRight: width / 4.9,
    },
  });
  return (
    <View style={styles.Container}>
      <View style={styles.RegisterFormContainer}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          value={userName}
          keyboardType="email-address"
          placeholder="Username"
          placeholderTextColor={
            isFocused === 'Username' ? '#45A4FF' : 'rgba(0,0,0,0.6)'
          }
          style={styles.UsernameInput}
          onFocus={() => setFocused('Username')}
          onChangeText={_email => setUserName(_email)}
        />
        <TextInput
          value={email}
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={
            isFocused === 'Email' ? '#45A4FF' : 'rgba(0,0,0,0.6)'
          }
          style={styles.EmailInput}
          onFocus={() => setFocused('Email')}
          onChangeText={_username => setEmail(_username)}
        />
        <TextInput
          keyboardType="visible-password"
          value={password}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={
            isFocused === 'Password' ? '#45A4FF' : 'rgba(0,0,0,0.6)'
          }
          style={styles.PassowrdInput}
          onFocus={() => setFocused('Password')}
          onChangeText={_password => setPassword(_password)}
        />
      </View>
      <View style={styles.RegisterButtonContainer}>
        <Text style={styles.ForgotPasswordText}>Forgot Password ?</Text>
        <TouchableOpacity
          onPress={() => {
            email.replace(/\s/g, '').length === 0 ||
            password.replace(/\s/g, '').length === 0
              ? null
              : RegisterWithEmailAndPassword();
          }}
          disabled={
            email.replace(/\s/g, '').length === 0 ||
            password.replace(/\s/g, '').length === 0
              ? true
              : false
          }
          style={styles.RegisterButton}>
          <Text style={styles.RegisterButtonText}>{'Register'}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          position: 'absolute',
          bottom: isKeyboardShown ? -20 : 36,
        }}>
        <Text style={{fontWeight: 'bold'}}>
          Don't have an account ?{' '}
          <Text
            onPress={() => {
              navigation.navigate('photogram.register.screen');
            }}
            style={{color: '#45A4FF'}}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}
