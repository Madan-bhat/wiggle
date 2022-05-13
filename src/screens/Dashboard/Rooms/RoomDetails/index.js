/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { height, width } from '../../../../constants';
import auth from '@react-native-firebase/auth';
import { StandaloneGallery } from 'react-native-gallery-toolkit';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { UsersList } from '../../../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Lightbox from 'react-native-lightbox';
import LinearGradient from 'react-native-linear-gradient';
import { DecryptData } from '../../../../functions';

export default function RoomDetail({ route, navigation }) {
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
            let { image } = data.data();
            Lists.push({
              image,
            });
            setGroupImages(Lists);
          });
        });
    } catch (error) {}
  }, [route.params.item.id]);

  const joinGroup = id => {
    if (route.params.item.type !== 'Any one can join') {
      navigation.navigate('photogram.password.screen', {
        password: route.params.item.password,
        item: route.params.item,
      });
    } else {
      firestore()
        .collection('groups')
        .doc(route.params.id)
        .update({
          members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        })
        .then(() => navigation.goBack());
    }
    // } else {

    //   } catch (error) {}
  };

  useEffect(() => {
    getUser();
    getGroupWithImages();
  }, [getUser, getGroupWithImages]);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={3}
        onPress={() =>
          navigation.navigate('photogram.image.view.screen', {
            image: route.params.item.groupImage,
          })
        }>
        <ImageBackground
          style={{ width, height: height / 3 }}
          source={{
            uri: route.params.item.groupImage
              ? route.params.item.groupImage
              : 'https://media.istockphoto.com/vectors/profile-picture-vector-illustration-vector-id587805156?k=20&m=587805156&s=612x612&w=0&h=Ok_jDFC5J1NgH20plEgbQZ46XheiAF8sVUKPvocne6Y=',
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
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
                fontSize: 38,
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
              created By {user ? DecryptData(user.userName) : 'unknown'},{' '}
              {moment(route.params.item.createdAt).format('L')}
            </Text>
          </View>
          {route.params.item?.ownerUid === auth().currentUser.uid ? (
            <LinearGradient
              style={{
                position: 'absolute',
                bottom: -30,
                elevation: 18,
                borderRadius: 100,
                height: 75,
                zIndex: 100,
                width: 75,
                alignItems: 'center',
                justifyContent: 'center',
                right: 10,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#FEAC5E', '#C779D0', '#4BC0C8']}>
              <FontAwesome
                onPress={() =>
                  navigation.navigate('photogram.edit.group.info.screen', {
                    info: route.params,
                  })
                }
                style={{ left: 1 }}
                name="edit"
                size={32}
                color="white"
              />
            </LinearGradient>
          ) : (
            <></>
          )}
        </ImageBackground>
      </TouchableOpacity>
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
            <Text style={{ fontFamily: 'Lato-Regular', marginLeft: 12 }}>
              No Images or Media
            </Text>
          </View>
        }
        data={groupImages}
        showsHorizontalScrollIndicator={false}
        style={{ marginRight: 4, marginLeft: 4 }}
        renderItem={({ item }) => {
          return (
            <>
              {route.params.item.members?.indexOf(auth().currentUser.uid) >
              -1 ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('photogram.image.view.screen', {
                        image: item.image,
                      })
                    }>
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        marginLeft: 4,
                        height: item.image ? 75 : 0,
                        marginTop: 4,
                        width: item.image ? 75 : 0,
                      }}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </>
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
              style={{ marginRight: 6 }}
              name="search1"
              size={24}
              color="black"
            />
          </View>
        }
        stickyHeaderIndices={[0, 6, 13]}
        renderItem={({ item }) => {
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
                {''}
              </Text>
            </TouchableOpacity>
          ) : null
        ) : null}
      </View>
      {route.name === 'photogram.chatDetails.screen' ? (
        <></>
      ) : (
        <TouchableOpacity onPress={() => joinGroup()}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../../assets/Dania.jpg')}
            style={styles.panelButton}>
            <View style={styles.panelButton}>
              <Text style={styles.panelButtonTitle}>
                {' '}
                {route.name === 'photogram.chatDetails.screen' ? '' : 'Join'}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
    </View>
  );
}

let styles = StyleSheet.create({
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: '#fff',
  },
  panelSubtitle: {
    fontSize: 14,
    color: '#fff',

    height: 30,
    marginBottom: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  panelButton: {
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 8,
  },
});
