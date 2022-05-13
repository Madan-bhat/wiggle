/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width } from '../../../constants/index';
import codePush from 'react-native-code-push';
import { DecryptData } from '../../../functions';

export default function Profile({ navigation }) {
  let [userData, setUserData] = useState();
  let [packageMetadata, setPackageMetadata] = useState();

  useEffect(() => {
    async function getPackageMetadata() {
      const data = await codePush.getCurrentPackage();
      console.log({ data });
      if (data) {
        setPackageMetadata(data);
      }
    }
    getPackageMetadata();
    // call once loaded
  }, []);

  const checkForUpdate = async () => {
    codePush.checkForUpdate().then(update => {
      if (!update) {
        Alert.alert('UPDATED !', 'The app is up to date!');
      } else {
        Alert.alert('AN UPDATE IS AVAILABLE', 'An update is available! ');
      }
    });
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  };

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
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <LinearGradient
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
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FEAC5E', '#C779D0', '#4BC0C8']}>
          <FontAwesome
            onPress={() => navigation.navigate('photogram.edit.profile.screen')}
            style={{ left: 1 }}
            name="edit"
            size={32}
            color="white"
          />
        </LinearGradient>
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
          {DecryptData(userData?.userName)}
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
          {DecryptData(userData?.userName)}
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
          padding: 18,
          borderRadius: 10,
          alignItems: 'center',
          marginVertical: 18,
          marginHorizontal: 12,
        }}
        onPress={() => checkForUpdate()}>
        <LinearGradient
          style={{
            padding: 18,
            borderRadius: 10,
            alignItems: 'center',
            marginVertical: 18,
            marginHorizontal: 12,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FEAC5E', '#C779D0', '#4BC0C8']}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>
            Check for updates
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
