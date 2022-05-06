import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { width } from '../../../../../constants';
import { DecryptData } from '../../../../../functions';

const Password = ({ route, navigation }) => {
  let [password, setPassword] = useState('');
  const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45,
    },

    borderStyleHighLighted: {
      borderColor: '#03DAC6',
    },

    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      marginTop: 24,
      padding: 13,
      width: width / 2,
      borderRadius: 10,
      backgroundColor: '#45A4F9',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },

    underlineStyleHighLighted: {
      borderColor: '#03DAC6',
    },
  });

  const JoinGroup = () => {
    if (DecryptData(route.params.password) === password) {
      firestore()
        .collection('groups')
        .doc(route.params.item.id)
        .update({
          members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        });
      ToastAndroid.show('Password is correct', 12);
      navigation.navigate('photogram.dashboard.screen');
    } else {
      ToastAndroid.show('Password is incorrect', 12);
    }
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
        {'Please enter the password to join'}
      </Text>
      <TextInput
        keyboardType="visible-password"
        placeholder="Password"
        style={{
          width: width - 24,
          backgroundColor: '#fff',
          fontSize: 18,
          fontFamily: 'Lato-Regular',
          fontWeight: 'bold',
        }}
        textAlign={'center'}
        onChangeText={_val => {
          setPassword(_val);
        }}
      />
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera => {
          JoinGroup();
        }}>
        <Text style={styles.panelButtonTitle}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Password;
