/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl, Alert} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {LaunchCard} from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';

export default function Launch({navigation}) {
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
  });
  const actions = [
    {
      text: 'Create a wiggle room',
      icon: <Ionicons name="create-outline" style={styles.actionButtonIcon} />,
      name: 'create',
      position: 1,
    },
    {
      text: 'Join to a wiggle room',
      icon: (
        <Ionicons name="person-add-outline" style={styles.actionButtonIcon} />
      ),
      name: 'join',
      position: 2,
    },
  ];

  let fetchGroups = useCallback(async () => {
    let Lists = [];

    try {
      await firestore()
        .collection('groups')
        .where('members', 'array-contains', auth().currentUser.uid)
        .onSnapshot(_doc => {
          _doc.docs.forEach(data => {
            let {
              description,
              groupName,
              groupImage,
              ownerUid,
              members,
              createdAt,
            } = data.data();
            Lists.push({
              description,
              groupName,
              id: data.id,
              groupImage,
              ownerUid,
              members,
              createdAt,
            });
            setGroups(Lists);
          });
        });
    } catch (error) {}
  }, []);

  let refreshControl = () => {
    setRefreshing(true);
    fetchGroups().then(setRefreshing(false));
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return ;
    }
  }
  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <View
        style={{
          marginTop: 24,
          marginBottom: 18,
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="ios-menu"
          size={36}
          style={{marginHorizontal: 12}}
          color="black"
        />
        <Text
          style={{
            fontWeight: '900',
            fontFamily: 'Lato-Bold',
            textShadowColor: '#fff',
            textShadowRadius: 24,
            elevation: 6,
            fontSize: 46,
          }}>
          Wiggle
        </Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={refreshControl} refreshing={refreshing} />
        }
        data={groups}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <LaunchCard
              groupName={item.groupName}
              navigation={navigation}
              item={item}
              groupId={item.id}
            />
          );
        }}
      />
      <FloatingAction
        actions={actions}
        color="#45A4F9"
        dismissKeyboardOnPress
        overlayColor="rgba(0,0,0,0.19)"
        onPressItem={name => {
          if (name === 'create') {
            navigation.navigate('photogram.create.screen');
          } else {
            navigation.navigate('photogram.join.screen');
          }
        }}
      />
    </View>
  );
}
