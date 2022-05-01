import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';

export default function AllUsers({item}) {
  let [users, setUsers] = useState([]);
  useEffect(() => {
    let Lists = [];
    try {
      async function users() {
        await firestore()
          .collection('users')
          .where('uid', '!=', item)
          .get()
          .then(users => {
            users.docs.forEach(_user_data => {
              let {createdAt, token, groups, userImg, userName, uid, email} =
                _user_data.data();
              Lists.push({
                createdAt,
                token,
                groups,
                userImg,
                userName,
                uid,
                email,
              });
              setUsers(Lists);
            });
          });
      }
    } catch (error) {}
  }, [item]);

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({itemFromFlatlist}) => (
          <Text>{JSON.stringify(itemFromFlatlist.userName)}</Text>
        )}
      />
    </View>
  );
}
