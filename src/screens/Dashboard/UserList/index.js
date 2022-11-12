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
  const [requested, setRequested] = useState();
  const [refreshing, setRefreshing] = useState(false);
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

  let fetchUsers = useCallback(async searchText => {
    let Lists = [];

    try {
      await firestore()
        .collection('users')
        .where('userName', '>=', searchText)
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
          placeholder={'search'}
          onChangeText={_text => {
            fetchUsers(_text);
          }}
          style={{
            marginHorizontal: 26,
            fontSize: 18,
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
      {/* <FloatingAction
        actions={actions}
        color="#45A4F9"
        dismissKeyboardOnPress
        overlayColor="rgba(0,0,0,0.19)"
        onPressItem={name => {
          if (name === 'create') {
          } else {
            navigation.navigate('photogram.join.screen');
          }
        }}
      /> */}
    </View>
  );
}
