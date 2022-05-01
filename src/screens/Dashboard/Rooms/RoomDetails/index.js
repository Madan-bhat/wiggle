/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {height, width} from '../../../../constants';
import auth from '@react-native-firebase/auth';
import {StandaloneGallery} from 'react-native-gallery-toolkit';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {UsersList} from '../../../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Lightbox from 'react-native-lightbox';

export default function RoomDetail({route, navigation}) {
  console.log(route);
  let [user, setUser] = useState();
  let [users, setUsers] = useState([]);
  let [groupImages, setGroupImages] = useState([]);
  const getUser = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(route.params.item.ownerUid)
        .get()
        .then(user => {
          setUser(user.data());
        });
    } catch (error) {}
  }, [route.params.item.ownerUid]);

  useEffect(() => {
    console.log(route.params);
  });

  let getGroupWithImages = useCallback(async () => {
    let Lists = [];
    try {
      await firestore()
        .collection('groups')
        .doc(route.params.item.id)
        .collection('Messages')
        .get()
        .then(_data => {
          _data.forEach(data => {
            let {image} = data.data();
            Lists.push({
              image,
            });
            setGroupImages(Lists);
          });
        });
    } catch (error) {}
  }, [route.params.item.id]);

  const joinGroup = id => {
    console.log(route.params.item.password)
    if (route.params.item.password) {
      navigation.navigate('photogram.password.screen',{
        password : route.params.item.password,
        item: route.params.item
      })
    }else {
      console.log('no password detected')
    }
    // } else {
    //   try {
    //     firestore()
    //       .collection('groups')
    //       .doc(route.params.id)
    //       .update({
    //         members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
    //       });
    //   } catch (error) {}
    
  };

  useEffect(() => {
    getUser();
    getGroupWithImages();
  }, [getUser, getGroupWithImages]);

  return (
    <View>
      <ImageBackground
        style={{width, height: height / 3}}
        source={{
          uri: route.params.item.groupImage
            ? route.params.item.groupImage
            : 'https://media.istockphoto.com/vectors/profile-picture-vector-illustration-vector-id587805156?k=20&m=587805156&s=612x612&w=0&h=Ok_jDFC5J1NgH20plEgbQZ46XheiAF8sVUKPvocne6Y=',
        }}>
        <View
          style={{
            marginTop: '48%',
            marginHorizontal: 8,
            shadowColor: '#000',
            shadowRadius: 18,
            elevation: 8,
          }}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              textShadowRadius: 39,
              textShadowColor: '#000',
              fontSize: 48,
              color: '#FFF',
            }}>
            {route.params.item.groupName}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              textShadowRadius: 19,
              textShadowColor: '#000',
              fontSize: 16,
              color: '#FFF',
            }}>
            created By {user ? user.userName : 'unknown'},{' '}
            {moment(route.params.item.createdAt).format('L')}
          </Text>
        </View>
      </ImageBackground>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Lato-Bold',
          marginLeft: 12,
          marginTop: 12,
          marginVertical: 4,
        }}>
        Media , Photos
      </Text>
      <FlatList
        horizontal
        ListEmptyComponent={
          <View>
            <Text style={{fontFamily: 'Lato-Regular', marginLeft: 12}}>
              No Images or Media
            </Text>
          </View>
        }
        data={groupImages}
        showsHorizontalScrollIndicator={false}
        style={{marginRight: 4, marginLeft: 4}}
        renderItem={({item}) => {
          return (
            <View>
              <Image
                source={{uri: item.image}}
                style={{
                  marginLeft: 4,
                  height: item.image ? 75 : 0,
                  marginTop: 4,
                  width: item.image ? 75 : 0,
                }}
              />
            </View>
          );
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={route.params.item.members}
        ListHeaderComponent={
          <View
            style={{
              padding: 18,
              marginTop: 16,
              width,
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 17,
                color: '#333',
              }}>
              {route.params.item.members.length} members
            </Text>
            <AntDesign
              style={{marginRight: 6}}
              name="search1"
              size={24}
              color="black"
            />
          </View>
        }
        stickyHeaderIndices={[0, 6, 13]}
        renderItem={({item}) => {
          setUsers(item);
          return (
            <UsersList
              data={item}
              ownerUid={route.params.item.ownerUid}
              members={route.params.item.members.length}
            />
          );
        }}
      />
      <View>
        {route.params.ownerUid === auth().currentUser.uid
          ? console.log('user is owner')
          : console.log('user is not your owner')}
        {route.name === 'photogram.chatDetails.screen' ? (
          route.params.item.ownerUid === auth().currentUser.uid ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('photogram.users.screen', {
                  members: route.params.item.members,
                })
              }>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 16,
                  marginTop: 6,
                  textAlign: 'center',
                }}>
                Add
              </Text>
            </TouchableOpacity>
          ) : null
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => joinGroup()}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 18,
            color: '#45A4FF',
          }}>
          {route.name === 'photogram.chatDetails.screen' ? '' : 'Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
