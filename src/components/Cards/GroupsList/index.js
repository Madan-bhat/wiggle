/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-paper';
import { height } from '../../../constants';

export default function GroupsListCard({ item, navigation }) {
  let [isInGroup, setIngroup] = useState(false);

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
      borderRadius: 900,
    },
  });

  return (
    <TouchableOpacity activeOpacity={1}>
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
                {moment(item.createdAt).format('LLL')}
              </Text>

              {item.members?.indexOf(auth().currentUser.uid) > -1 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('photogram.chat.screen', {
                      item: item,
                      headerTitle: item.groupName,
                      id: item.id,
                    })
                  }
                  style={{ marginTop: 12 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Regular',
                      color: '#45A4FF',
                    }}
                  >
                    Already in group
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('photogram.roomdetails.screen', {
                      item: item,
                      id: item.id,
                    })
                  }
                  style={{ marginTop: 12 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Regular',
                      color: '#45A4FF',
                    }}
                  >
                    Details
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}
