/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { width, height } from '../../../constants/Dimesions';
import { DecryptData } from '../../../functions';
import styled from 'styled-components';
import Clipboard from '@react-native-community/clipboard';

export default function MessageCard({ item, navigation }) {
  let [user, setUser] = useState();

  let getUser = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(item.uid)
        .get()
        .then(_user => {
          setUser(_user.data());
        });
    } catch (e) {}
  }, [item.uid]);

  const copyToClipboard = messageText => {
    Clipboard.setString(messageText);
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <TouchableOpacity
      activeOpacity={3}
      onLongPress={() => copyToClipboard(DecryptData(item.messageText))}>
      <View style={{ position: 'absolute', top: 24 }}>
        {user?.uid === auth().currentUser.uid ? null : (
          <Image
            source={{
              uri:
                user?.uid === auth().currentUser.uid
                  ? null
                  : user?.userImg
                  ? user?.userImg
                  : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
            }}
            style={{
              width: user?.uid === auth().currentUser.uid ? 0 : 36,
              marginRight: user?.uid === auth().currentUser.uid ? 0 : 8,
              borderRadius: user?.uid === auth().currentUser.uid ? 0 : 85,
              marginLeft: user?.uid === auth().currentUser.uid ? 0 : 8,
              height: user?.uid === auth().currentUser.uid ? 0 : 36,
            }}
          />
        )}
      </View>
      <View>
        <ImageBackground
          imageStyle={{ borderRadius: 18 }}
          source={
            user?.uid === auth().currentUser.uid
              ? require('../../../../assets/Dania.jpg')
              : null
          }
          style={{
            padding: item.image ? 0 : 24,
            paddingRight: item.image ? 0 : 24,
            paddingBottom: item.image ? 0 : 24,
            paddingTop: item.image ? 0 : 24,
            borderRadius: 18,
            marginTop: 14,
            marginRight: item.uid === auth().currentUser.uid ? 12 : width / 2.5,
            marginLeft: item.uid === auth().currentUser.uid ? width / 2.5 : 52,
            alignSelf:
              item.uid !== auth().currentUser.uid ? 'flex-start' : 'flex-end',
            backgroundColor:
              item.uid === auth().currentUser?.uid ? null : '#fff',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('photogram.image.view.screen', {
                image: item.image,
              })
            }>
            <Image
              style={{
                height: item.image ? height / 4 : 0,
                width: item.image ? width / 1.5 : 0,
                borderRadius: 18,
              }}
              source={{ uri: item.image ? item.image : null }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginRight: item.image ? 8 : 0,
              fontWeight: '800',
              fontSize: 18,
              marginLeft: item.image ? 8 : 0,
              marginTop: item.image ? 8 : 0,
              fontFamily: 'Lato-Regular',
              color: item.uid === auth().currentUser.uid ? 'white' : 'black',
            }}>
            {DecryptData(item.messageText)}
          </Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}
