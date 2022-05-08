/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import GroupsListCard from '../../../../components/Cards/GroupsList';
import { height } from '../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';

export default function Join({ navigation }) {
  const [groups, setGroups] = useState([]);

  let FetchGroups = useCallback(async searchText => {
    let Lists = [];
    try {
      await firestore()
        .collection('groups')
        .where('groupName', '>=', searchText)
        .onSnapshot(val => {
          val.docs.forEach(data => {
            let {
              description,
              groupName,
              groupImage,
              ownerUid,
              members,
              password,
              createdAt,
            } = data.data();
            Lists.push({
              description,
              groupName,
              id: data.id,
              groupImage,
              ownerUid,
              password,
              members,
              createdAt,
            });
            setGroups(Lists);
          });
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    setTimeout(() => {
    FetchGroups();
    }, 1000);
  }, [FetchGroups, groups]);

  let styles = StyleSheet.create({
    title: {
      fontSize: height / 14,
      marginHorizontal: 24,
      marginVertical: 18,
      fontFamily: 'Lato-Bold',
    },
    searchInput: {
      marginHorizontal: 24,
      fontFamily: 'Lato-Bold',

      borderRadius: 8,
      marginRight: 44,
      padding: 14,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  });

  return (
    <View style={{ flex: 1, height: height, backgroundColor: '#fff' }}>
      <View
        style={{
          marginTop: 24,
          marginBottom: 18,
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="left"
            size={36}
            style={{ marginHorizontal: 12 }}
            color="black"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: '900',
            fontFamily: 'Lato-Bold',
            textShadowColor: '#fff',
            textShadowRadius: 24,
            elevation: 6,
            fontSize: 46,
          }}>
          Join
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 4,
          marginBottom: 12,
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
            FetchGroups(_text);
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

      <View
        style={{
          backgroundColor: '#fff',
          height,
          borderTopStartRadius: 24,
        }}>
        <ScrollView>
          <FlatList
            style={{ marginBottom: 24 }}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 100,
                  flex: 1,
                  display: 'flex',
                }}>
                <Text>Search For Groups</Text>
              </View>
            }
            data={groups}
            contentContainerStyle={{ marginTop: 12, marginBottom: 12 }}
            renderItem={({ item }) => {
              return <GroupsListCard navigation={navigation} item={item} />;
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
}
