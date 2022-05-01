import {firebase} from '@react-native-firebase/firestore';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {AllUsers} from '../../../components';

export default function Users({route}) {
  useEffect(function () {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot(value => {
        value.docs.forEach(_data => {
          let Lists = [];
          Lists.push(_data.data());
         let data = Lists.indexOf(route.params.members,-1)
         console.log(data)
        });
      });
  });

  return (
    <View>
      <FlatList
        data={route.params.members}
        renderItem={({item}) => {
          return <AllUsers item={item} />;
        }}
      />
    </View>
  );
}
