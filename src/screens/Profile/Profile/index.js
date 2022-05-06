/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { height, width } from '../../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import CodePush from 'react-native-code-push';

export default function Profile({ navigation }) {
  let [userData, setUserData] = useState();

  function checkForUpdates() {
    CodePush.sync({
      updateDialog: true,
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
  }

  let getUser = useCallback(() => {
    try {
      firebase
        .firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .get()
        .then(_data => {
          setUserData(_data.data());
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <View>
      <View>
        <View
          style={{
            position: 'absolute',
            bottom: -30,
            elevation: 18,
            borderRadius: 100,
            height: 75,
            backgroundColor: '#45aaf4',
            zIndex: 100,
            width: 75,
            alignItems: 'center',
            justifyContent: 'center',
            right: 10,
          }}>
          <FontAwesome
            onPress={() => navigation.navigate('photogram.edit.profile.screen')}
            style={{ left: 1 }}
            name="edit"
            size={32}
            color="white"
          />
        </View>
        <TouchableOpacity
          activeOpacity={3}
          onPress={() =>
            navigation.navigate('photogram.image.view.screen', {
              image: userData?.userImg,
            })
          }>
          <Image
            source={{ uri: userData?.userImg }}
            style={{ width, height: 256, backgroundColor: 'rgba(0,0,0,0.5)' }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            bottom: 4,
            left: 18,
            elevation: 18,
            fontFamily: 'Lato-Bold',
            position: 'absolute',
            fontSize: 36,
            marginTop: 24,
          }}>
          {userData?.userName}
        </Text>
      </View>
      <View>
        <Text style={{ marginTop: 24, marginLeft: 24 - 6 }}>User Name</Text>
        <Text
          style={{
            fontSize: 24 - 4,
            fontWeight: 'bold',
            marginHorizontal: 18,
          }}>
          {userData?.userName}
        </Text>
      </View>
      <View>
        <Text style={{ marginTop: 24, marginLeft: 24 - 6 }}>Email</Text>
        <Text
          style={{
            fontSize: 24 - 4,
            fontWeight: 'bold',
            marginHorizontal: 18,
          }}>
          {userData?.email}
        </Text>
      </View>
      <View>
        <Text style={{ marginTop: 24, marginLeft: 24 - 6 }}>User id</Text>
        <Text
          style={{
            fontSize: 24 - 4,
            fontWeight: 'bold',
            marginHorizontal: 18,
          }}>
          {userData?.uid}
        </Text>
      </View>
      <View>
        <Text style={{ marginTop: 24, marginLeft: 24 - 6 }}>Token</Text>
        <Text
          style={{
            fontSize: 24 - 4,
            fontWeight: 'bold',
            marginHorizontal: 18,
          }}>
          {userData?.token}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          padding: 13,
          borderRadius: 10,
          backgroundColor: 'red',
          alignItems: 'center',
          marginVertical: 18,
          marginHorizontal: 12,
        }}
        onPress={checkForUpdates()}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>
          Check for updates
        </Text>
      </TouchableOpacity>
    </View>
  );
}
