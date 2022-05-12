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
import { width } from '../../../../../constants';
import { DecryptData } from '../../../../../functions';
import LinearGradient from 'react-native-linear-gradient';

const Password = ({ route, navigation }) => {
  let [password, setPassword] = useState('');

  const JoinGroup = () => {
    if (route.params.password !== '') {
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
    } else {
      firestore()
        .collection('groups')
        .doc(route.params.item.id)
        .update({
          members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        });
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
        }}
      >
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
      <TouchableOpacity style={{ marginTop: 18 }} onPress={() => JoinGroup()}>
        <ImageBackground
          imageStyle={{
            borderRadius: 10,
          }}
          source={require('../../../../../../assets/Dania.jpg')}
          style={styles.panelButton}
        >
          <View style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Join</Text>
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

export default Password;
