/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FlashList } from '@shopify/flash-list';
import { DecryptData } from '../../../functions';

export default function RequestLists({ item }) {
  let [user, setUser] = useState([]);
  let [requested, setRequested] = useState([]);

  let getUser = useCallback(async () => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(_data => {
        setUser(_data.data());
      });
  }, []);

  let checkRequested = async m => {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .onSnapshot(_doc => {
          let { requested } = _doc.data();
          setRequested(requested);
        });
    } catch (error) {}
  };
  useEffect(() => {
    checkRequested();
    getUser();
  }, [getUser]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    cardStyle: {
      shadowColor: '#000',
      elevation: 8,
      flexDirection: 'row',
      marginHorizontal: 12,
    },
    ImageStyle: {
      height: 50,
      width: 50,
      marginLeft: 18,
      borderRadius: 900,
    },
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginTop: 10,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
      width: '100%',
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: { width: -1, height: -3 },
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
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
      padding: 8,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      paddingLeft: 10,
      color: '#333333',
    },
  });

  const AcceptRequest = () => {
    let currentUser = {
      uid: user?.uid,
      userName: user?.userName,
      userImg: user?.userImg,
    };
    try {
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          Chats: firestore.FieldValue.arrayUnion(item),
          requests: firestore.FieldValue.arrayRemove(item),
        })
        .then(() => {
          console.log('added 1');
        });
      firestore()
        .collection('users')
        .doc(item?.uid)
        .update({
          Chats: firestore.FieldValue.arrayUnion(currentUser),
          requested: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        })
        .then(() => console.log('added 2'));
    } catch (error) {}
  };

  const DeclineRequest = () => {
    try {
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          requests: firestore.FieldValue.arrayRemove(item),
        })
        .then(() => {
          console.log('added 1');
        });
      firestore()
        .collection('users')
        .doc(item?.uid)
        .update({
          requested: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        })
        .then(() => console.log('added 2'));
    } catch (error) {}
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            elevation: 6,
            shadowColor: '#000',
            borderRadius: 6,
            padding: 4,
            backgroundColor: '#fff',
            marginVertical: 12,
            marginHorizontal: 24,
          }}>
          <View style={{ flexDirection: 'row', marginVertical: 12 }}>
            <Image
              source={{
                uri: item.userImg
                  ? item.userImg
                  : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
              }}
              style={styles.ImageStyle}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontFamily: 'Lato-Bold' }}>
                {DecryptData(item.userName)}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  marginTop: 2,
                }}>
                {moment(item.createdAt).format('LL')}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginLeft: '18%',
              flexDirection: 'row',
              marginTop: '5%',
            }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => AcceptRequest()}>
              <Text style={{ color: '#37d67a', fontWeight: 'bold' }}>
                {'Accept'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => DeclineRequest()}
              style={{ marginRight: 10 }}>
              <Text style={{ color: '#f47373', fontWeight: 'bold' }}>
                {'Decline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
