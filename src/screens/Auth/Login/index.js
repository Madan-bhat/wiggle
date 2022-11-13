import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { height, width } from '../../../constants';

export default function Login({ navigation }) {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [isKeyboardShown, setKeyboard] = useState(false);

  let [isFocused, setFocused] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboard(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false);
    });
  });

  const LoginWithEmailAndPassword = () => {
    try {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)

        .catch(e => {
          Alert.alert(e?.message);
        })
        .then(() => {
          setLoading(false);
        });
    } catch (error) {}
  };

  const styles = StyleSheet.create({
    Container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    LoginFormContainer: {
      height: height / 3.0,
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
    EmailInput: {
      padding: 8,
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
    LoginButtonContainer: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      marginTop: 12,
    },
    LoginButton: {
      padding: 18,
      marginTop: 12,
      display: 'flex',
      left: 0,
      marginRight: width / 4,
      borderRadius: 8,
      paddingLeft: 42,
      paddingRight: 42,
      alignSelf: 'flex-end',
      shadowColor: '#000',
      elevation: 8,
    },
    LoginButtonText: {
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
      <View style={styles.LoginFormContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          value={email}
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={
            isFocused === 'Email' ? '#45A4FF' : 'rgba(0,0,0,0.6)'
          }
          style={styles.EmailInput}
          onFocus={() => setFocused('Email')}
          onChangeText={_email => setEmail(_email)}
        />
        <TextInput
          keyboardType="email-address"
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={
            isFocused === 'Password' ? '#45A4FF' : 'rgba(0,0,0,0.6)'
          }
          style={styles.PassowrdInput}
          onFocus={() => setFocused('Password')}
          onChangeText={_password => setPassword(_password)}
        />
      </View>
      <View style={styles.LoginButtonContainer}>
        <Text
          onPress={() => {
            navigation.navigate('photogram.forgot.password.screen');
          }}
          style={styles.ForgotPasswordText}>
          Forgot Password ?
        </Text>
        <TouchableOpacity
          onPress={() => {
            email.replace(/\s/g, '').length === 0 ||
            password.replace(/\s/g, '').length === 0
              ? null
              : loading
              ? null
              : LoginWithEmailAndPassword();
          }}
          disabled={
            email.replace(/\s/g, '').length === 0 ||
            password.replace(/\s/g, '').length === 0
              ? true
              : false
          }>
          <ImageBackground
            imageStyle={{ borderRadius: 8 }}
            style={styles.LoginButton}
            source={require('../../../../assets/Dania.jpg')}>
            {loading ? (
              <ActivityIndicator color={'#fff'} size={18} />
            ) : (
              <Text style={styles.LoginButtonText}>{'Login'}</Text>
            )}
          </ImageBackground>
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
        <Text style={{ fontWeight: 'bold' }}>
          Don't have an account ?{' '}
          <Text
            onPress={() => {
              navigation.navigate('photogram.register.screen');
            }}
            style={{ color: '#45A4FF' }}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}
