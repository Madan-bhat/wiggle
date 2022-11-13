/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  BackHandler,
  RefreshControl,
  TextInput,
  Button,
  AsyncStorage,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { FAB, Portal, Provider } from 'react-native-paper';
import { LaunchCard } from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import BottomSheet from 'reanimated-bottom-sheet';

import { height, width } from '../../../constants';
import Animated from 'react-native-reanimated';
import mmkv from 'react-native-mmkv';
import UserLists from '../../../components/Cards/UserLists';

export default function UserList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let fetchUsers = useCallback(async searchText => {
    let Lists = [];

    try {
      await firestore()
        .collection('users')
        .where('uid', '!=', auth().currentUser.uid)
        .onSnapshot(_doc => {
          _doc.docs.forEach(data => {
            let { uid, userName, userImg, token } = data.data();
            Lists.push({
              uid,
              userName,
              userImg,
              token,
            });
            setUsers(Lists);
          });
        });
    } catch (error) {}
  }, []);

  let refreshControl = () => {
    setRefreshing(true);
    fetchUsers().then(setRefreshing(false));
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return;
    }
  }
  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: '#FFF',
      }}>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 4,
          marginBottom: 12,
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.1)',
          marginHorizontal: 24,
        }}>
        <AntDesign
          style={{ marginLeft: 12 }}
          name="search1"
          size={24}
          color={'#000'}
        />
        <TextInput
          placeholder={'Search'}
          placeholderTextColor={'#000'}
          onChangeText={_text => {
            fetchUsers(_text);
          }}
          style={{
            marginHorizontal: 26,
            fontSize: 18,
            color: '#000',
            borderRadius: 4,
            textAlign: 'center',
            width: '65%',
            fontFamily: 'Lato-Regular',
          }}
        />
      </View>
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={refreshControl} refreshing={refreshing} />
        }
        data={users}
        style={{ height }}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 18 }}>
              {'You can join a group by pressing + icon'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return <UserLists item={item} />;
        }}
      />
    </View>
  );
}
