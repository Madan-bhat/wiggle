/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DecryptData } from '../../../functions';

export default function LaunchCard({ navigation, groupId, item, groupName }) {
  let styles = StyleSheet.create({
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
  });

  // function getTheLastMessage() {
  //   try {
  //     firestore()
  //       .collection('groups')
  //       .doc(groupId)
  //       .collection('Messages')
  //       .orderBy('createdAt','asc')
  //       .limitToLast(1)
  //       .onSnapshot(_data => {
  //         _data.docs.forEach(data => {
  //         })
  //       })
  //   } catch (error) {}
  // }

  // useEffect(() => {
  //   getTheLastMessage();
  // },[]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        navigation.navigate('photogram.chat.screen', {
          headerTitle: groupName,
          id: item.id,
          item: item,
          members: item.members,
        });
      }}
    >
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
          }}
        >
          <View style={{ flexDirection: 'row', marginVertical: 12 }}>
            <Text style={{ position: 'absolute', left: 300 }}>
              {item.members.lengths}
            </Text>
            <Image
              source={{
                uri: item.groupImage
                  ? item.groupImage
                  : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
              }}
              style={styles.ImageStyle}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontFamily: 'Lato-Bold' }}>{item.groupName}</Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {moment(item.createdAt).format('LL')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}
