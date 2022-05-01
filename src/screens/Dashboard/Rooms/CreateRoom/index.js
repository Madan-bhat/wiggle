/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {height} from '../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ScrollView} from 'react-native-gesture-handler';
import {atob, Base64, btoa} from 'js-base64';

export default function Create({navigation}) {
  const [pickerValue, setPickerValue] = useState(2);
  const [type, setType] = useState();
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState();
  const [uploading, setUploading] = useState(false);
  const [encodedPassword, setEncodedPassword] = useState('');

  let styles = StyleSheet.create({
    Container: {flex: 1, backgroundColor: '#fff', height},
    nameInput: {
      shadowColor: '#333',
      elevation: 48,
      padding: 12,
      marginHorizontal: 12,
      marginTop: 24,
      borderRadius: 12,
      backgroundColor: '#fff',
    },
    picker: {
      elevation: 8,
      backgroundColor: 'transparent',
      marginHorizontal: 12,
      borderRadius: 12,
    },
    numberOfMembers: {
      backgroundColor: '#fff',
      marginTop: 12,
      marginHorizontal: 28,
    },
    pickerContainer: {
      marginTop: 12,
      backgroundColor: '#fff',
      display: 'flex',
      marginHorizontal: 12,
      borderRadius: 12,
      shadowColor: '#333',
      elevation: 48,
    },
    groupImage: {
      height: 125,
      width: 125,
      marginTop: 8,
      alignSelf: 'center',
      borderRadius: 900,
    },
    imagePickerStyle: {
      textAlign: 'center',
      marginTop: 8,
      color: '#45A4FF',
    },
    createButton: {
      backgroundColor: '#45A4FF',
      padding: 18,
      marginHorizontal: 12,
      marginTop: 28,
      borderRadius: 12,
      opacity: groupName.replace(/\s/g, '').length < 5 ? 0.5 : 18,
      shadowColor: '#000',
      elevation: groupName.replace(/\s/g, '').length < 5 ? 0 : 18,
      marginBottom: 28,
    },
  });

  let PickImage = () => {
    ImagePicker.openPicker({
      width: 1300,
      height: 1400,
      cropping: true,
      compressImageQuality: 1,
    }).then(image => {
      setImageUri(image.path);
      console.log(image);
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      return null;
    } else {
      const path = `photos/${auth().currentUser.uid}/${Date.now()}`;
      return new Promise(async (resolve, rej) => {
        const response = await fetch(imageUri);
        const file = await response.blob();
        let upload = storage().ref(path).put(file);
        upload.on(
          'state_changed',
          snapshot => {
            setUploading(true);
            console.log(
              `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
            ),
              setVisible(true);
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          err => {
            rej(err);
          },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL();
            setImageUrl(url);
            setVisible(false);
            setUploading(false);
            console.log(url);
            resolve(url);
            setImageUri(null);
            return url;
          },
        );
      });
    }
  };

  let encryptPassword = () => {
    let encryptedPassword = btoa(password);
    setEncodedPassword(encryptedPassword);
  };

  let createGroup = async () => {
    encryptPassword()
    let url = await uploadImage();
    try {
      firestore()
        .collection('groups')
        .doc(`${groupName.replace(/\s/g, '').toLowerCase()}`)
        .collection('Members')
        .doc(auth().currentUser?.uid)
        .set({
          uid: auth().currentUser.uid,
        })
        .then(() => {
          firestore()
            .collection('groups')
            .doc(`${groupName.replace(/\s/g, '').toLowerCase()}`)
            .set({
              groupName,
              createdAt: Date.now(),
              numberOfMembers: pickerValue,
              ownerUid: auth().currentUser.uid,
              description,
              password: encodedPassword,
              type,
              requests: type === 'Approval' ? [] : null,
              members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
              groupImage: url ? url : '',
            })
            .then(() => {
              firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .update({
                  groups: firestore.FieldValue.arrayUnion(
                    groupName.replace(/\s/g, '').toLowerCase(),
                  ),
                });
            })
            .then(() => {
              navigation.goBack();
            })
            .catch(e => alert(e));
        })
        .catch(e => alert(e));
    } catch (error) {}
  };

  useEffect(() => {
    setTimeout(() => {
      encryptPassword();
    }, 1);
  }, []);

  return (
    <ScrollView style={styles.Container}>
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
            style={{marginHorizontal: 12}}
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
          Create
        </Text>
      </View>
      <View>
        <Image
          source={{
            uri: imageUri
              ? imageUri
              : 'https://media.istockphoto.com/vectors/profile-picture-vector-illustration-vector-id587805156?k=20&m=587805156&s=612x612&w=0&h=Ok_jDFC5J1NgH20plEgbQZ46XheiAF8sVUKPvocne6Y=',
          }}
          style={styles.groupImage}
        />
        <Pressable onPress={PickImage}>
          <Text style={styles.imagePickerStyle}>Choose Photo</Text>
        </Pressable>
        <TextInput
          value={groupName}
          onChangeText={_val => setGroupName(_val)}
          placeholder="Name"
          style={styles.nameInput}
        />
        <TextInput
          value={description}
          onChangeText={_val => setDescription(_val)}
          placeholder="Description (optional)"
          style={[styles.nameInput, {marginTop: 8}]}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.numberOfMembers}>Number Of Members</Text>
          <Picker
            mode={'dialog'}
            selectedValue={pickerValue}
            onValueChange={(itemValue, value) => {
              setPickerValue(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
            <Picker.Item label="12" value="12" />
            <Picker.Item label="13" value="13" />
            <Picker.Item label="14" value="14" />
            <Picker.Item label="15" value="15" />
            <Picker.Item label="16" value="16" />
            <Picker.Item label="17" value="17" />
            <Picker.Item label="18" value="18" />
            <Picker.Item label="19" value="19" />
            <Picker.Item label="20" value="20" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.numberOfMembers}>Type</Text>
          <Picker
            mode={'dialog'}
            selectedValue={type}
            onValueChange={(itemValue, value) => {
              setType(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label="Approval" value="Approval" />
            <Picker.Item label="Any one can Join" value="Any one can Join" />
          </Picker>
        </View>
      </View>
      {type === 'Approval' ? (
        <TextInput
          onT
          value={password}
          onChangeText={_val => {
            encryptPassword();
            setPassword(_val);
          }}
          placeholder="Password"
          secureTextEntry
          style={styles.nameInput}
        />
      ) : null}
      <Pressable
        disabled={groupName.replace(/\s/g, '').length < 5 ? true : false}
        style={styles.createButton}
        onPress={() => createGroup()}>
        {uploading === true ? (
          <ActivityIndicator size={24} color={'#fff'} />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: '#fff',
              fontWeight: 'bold',
            }}>
            Create
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
