/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {View, Text, Image} from 'react-native';
import {width, height} from '../../../constants/Dimesions';

export default function MessageCard({item, navigation}) {
  // let [user, setUser] = useState();

  let getUser = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(item.uid)
        .get()
        .then(_user => {
          // setUser(_user.data());
        });
    } catch (e) {}
  }, [item.uid]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <View>
      <Image
        style={{
          height: item.image ? height / 4 : 0,
          width: item.image ? width / 2 : 0,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderBottomLeftRadius: 18,
        }}
        source={{uri: item.image ? item.image : null}}
      />
      <Text
        style={{
          fontFamily: 'Lato-Regular',
          textAlign: item.uid === auth().currentUser.uid ? 'right' : 'left',
        }}>
        {item.messageText}
      </Text>
    </View>
  );
}
