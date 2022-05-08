/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { width, height } from '../../../constants/Dimesions';
import { DecryptData } from '../../../functions';

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

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <View>
      <View style={{ position: 'absolute', top: 24 }}>
        {user?.uid === auth().currentUser.uid ? (
          <></>
        ) : (
          <Image
            source={{
              uri: user?.userImg
                ? user?.userImg
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
            }}
            style={{
              width: 36,
              marginRight: 8,
              borderRadius: 85,
              marginLeft: 8,
              height: 36,
            }}
          />
        )}
      </View>
      <View>
        <View
          style={{
            padding: item.image ? 0 : 24,
            paddingRight: item.image ? 0 : 24,
            paddingBottom: item.image ? 18 : 24,
            paddingTop: item.image ? 0 : 24,
            borderRadius: 18,
            marginTop: 14,
            marginRight: item.uid === auth().currentUser.uid ? 12 : width / 2.5,
            marginLeft: item.uid === auth().currentUser.uid ? width / 2.5 : 52,
            alignSelf:
              item.uid !== auth().currentUser.uid ? 'flex-start' : 'flex-end',
            backgroundColor:
              item.uid === auth().currentUser?.uid ? '#45aaf4' : '#fff',
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
              marginLeft: item.image ? 8 : 0,
              marginTop: item.image ? 8 : 0,
              fontFamily: 'Lato-Regular',
              color: item.uid === auth().currentUser.uid ? 'white' : 'black',
            }}>
            {DecryptData(item.messageText)}
          </Text>
        </View>
      </View>
    </View>
  );
}
