/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

export default function UsersList({data, members, ownerUid }) {
  let [users, setUsers] = useState([]);
  let getAllUsersInGroup = useCallback(async () => {
    let usersFromDb = [];
    try {
      await firestore()
        .collection('users')
        .doc(data)
        .get()
        .then(_data => {
          let {userName, createdAt, userImg, uid} = _data.data();
          usersFromDb.push({
            userName,
            createdAt,
            uid,
            userImg,
          });
          setUsers(usersFromDb);
        });
    } catch (error) {}
  }, [data]);

  useEffect(() => {
    getAllUsersInGroup();
  }, [getAllUsersInGroup]);

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                padding: 12,
                display: 'flex',
                backgroundColor: '#fff',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 50, height: 50, borderRadius: 100}}
                source={{
                  uri: item.image
                    ? item.image
                    : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
                }}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  marginLeft: 8,
                  fontSize: 18,
                }}>
                {item.userName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: '#FFF',
                  position: 'absolute',
                  borderRadius: 25,
                  padding: item.uid === ownerUid ? 8 : 0,
                  left: '89%',
                  backgroundColor: '#45A4FF',
                }}>
                {item.uid === ownerUid ? 'Admin' : null}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: '#FFF',
                  position: 'absolute',
                  borderRadius: 25,
                  paddingTop:
                    item.uid === ownerUid
                      ? 0
                      : item.uid === auth().currentUser.uid
                      ? 8
                      : 0,
                  paddingBottom:
                    item.uid === ownerUid
                      ? 0
                      : item.uid === auth().currentUser.uid
                      ? 8
                      : 0,
                  paddingRight:
                    item.uid === ownerUid
                      ? 0
                      : item.uid === auth().currentUser.uid
                      ? 16
                      : 0,
                  paddingLeft:
                    item.uid === ownerUid
                      ? 0
                      : item.uid === auth().currentUser.uid
                      ? 16
                      : 0,
                  left: '89%',
                  zIndex: item.uid === ownerUid ? -100 : 100,
                  backgroundColor: '#00d084',
                }}>
                {item.uid === ownerUid
                  ? ''
                  : item.uid === auth().currentUser.uid
                  ? 'You'
                  : ''}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
