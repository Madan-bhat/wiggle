import { firebase } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Users({ route }) {
  let [users, setUsers] = useState([]);

  function getUsers() {
    firebase
      .firestore()
      .collection('users')
      .get()
      .then(value => {
        value.docs.forEach(_data => {
          let Lists = [];
          let { email, userName, userImg, groups, token, uid } = _data.data();
          Lists.push({
            email,
            userName,
            userImg,
            groups,
            token,
            uid,
          });
          setUsers(Lists);
        });
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                I am the only developer 😊
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
