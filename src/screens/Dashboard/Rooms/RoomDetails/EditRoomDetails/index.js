/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, memo, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ImageBackground,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { DecryptData, EncryptData } from '../../../../../functions';

function EditRoomDetails(props) {
  let padding = 24;
  let { height } = Dimensions.get('window');
  const [imageUri, setImageUri] = useState('');
  const [updating, setupdating] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [visible, setVisible] = useState(false);
  const [groupName, setgroupName] = useState('');
  const [password, setPassword] = useState('');
  const [firestoreData, setFirestoreData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 700,
      height: 700,
      cropping: true,
    }).then(image => {
      setImageUri(`data:image/jpeg;base64,${image.data}`);
      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(image => {
      setImageUri(`data:image/jpeg;base64,${image.data}`);
      bs.current.snapTo(1);
    });
  };

  const onUpdate = async () => {
    if (firestoreData.type !== 'Approval') {
      firestore()
        .collection('groups')
        .doc(props.route.params.info.item.id)
        .update({
          groupName: groupName
            ? groupName
            : props.route.params.info.item.groupName,
          password: EncryptData(password)
            ? EncryptData(password)
            : firestoreData?.password,
          groupImage: imageUri || null,
          type: password.length > 3 ? 'Approval' : 'Any one can join',
          uid: auth().currentUser.uid,
        })
        .then(() => {
          setupdating(false);
        });
    } else {
      if (
        DecryptData(firestoreData.password) === password &&
        groupName.length < 3
      ) {
        if (DecryptData(firestoreData.password !== currentPassword)) {
          ToastAndroid.show('Password do not match', 12);
        }
        setupdating(false);
      } else {
        firestore()
          .collection('groups')
          .doc(props.route.params.info.item.id)
          .update({
            groupName: groupName
              ? groupName
              : props.route.params.info.item.groupName,
            password: EncryptData(password)
              ? EncryptData(password)
              : firestoreData?.password,
            groupImage: imageUri || null,
            type: password.length > 3 ? 'Approval' : 'Any one can join',
            uid: auth().currentUser.uid,
          })
          .then(() => {
            setupdating(false);
          });
      }
    }
  };

  const getGroupPasswordAndtype = useCallback(() => {
    try {
      firestore()
        .collection('groups')
        .doc(props.route.params.info.item.id)
        .onSnapshot(_data => {
          setFirestoreData({
            password: _data?.data().password,
            type: _data.data().type,
          });
        });
    } catch (error) {}
  }, [props.route.params.info.item.id]);

  useEffect(() => {
    getGroupPasswordAndtype();
  }, [getGroupPasswordAndtype]);

  let renderInner = () => {
    return (
      <View style={styles.panel}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
          <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <ImageBackground
          imageStyle={{
            borderRadius: 10,
          }}
          source={require('../../../../../../assets/Dania.jpg')}
          style={styles.panelButton}>
          <View style={styles.panelButton} onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </View>
        </ImageBackground>
        <TouchableOpacity onPress={choosePhotoFromLibrary}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../../../assets/Dania.jpg')}
            style={styles.panelButton}>
            <View style={styles.panelButton}>
              <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => bs.current.snapTo(1)}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../../../assets/Dania.jpg')}
            style={styles.panelButton}>
            <View
              style={styles.panelButton}
              onPress={() => bs.current.snapTo(1)}>
              <Text style={styles.panelButtonTitle}>Cancel</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  let bs;
  let fall;
  bs = React.createRef();
  fall = new Animated.Value(1);

  let renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={{ backgroundColor: '#FFF', padding: padding - 4 }}>
        <SafeAreaView
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <MaterialIcons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text
            fontSize={padding - 3}
            style={{
              fontSize: padding - 3,
              fontWeight: 'bold',
              left: 0,
              alignSelf: 'flex-start',
            }}>
            {'Edit Profile'}
          </Text>
          {updating ? (
            <ActivityIndicator color={'#128EF2'} size={24} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setupdating(true);
                onUpdate();
              }}>
              <MaterialIcons name="done" size={28} color="#128EF2" />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
      <BottomSheet
        ref={bs}
        snapPoints={[330, -5]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <KeyboardAvoidingView enabled={true} behavior={'padding'}>
        <TouchableOpacity
          style={{ alignSelf: 'center' }}
          onPress={() => bs.current.snapTo(0)}>
          <ImageBackground
            source={{
              uri: imageUri
                ? imageUri
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
            }}
            style={{ height: 100, width: 100 }}
            imageStyle={{ borderRadius: 15 }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.20)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <MaterialCommunityIcons
                name="camera"
                size={35}
                color="#fff"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </View>
          </ImageBackground>
        </TouchableOpacity>
        {/* Main */}
        <View style={{ marginTop: padding + 6 }}>
          <View>
            <Text style={{ marginLeft: padding - 6 }}>Group Name</Text>
            <TextInput
              onChangeText={val => setgroupName(val)}
              style={{
                fontSize: padding - 4,
                borderBottomColor: 'rgba(0,0,0,0.4)',
                marginHorizontal: 18,
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>
        <View>
          {firestoreData.type !== 'Any one can join' ? (
            <>
              <Text style={{ marginTop: padding - 6, marginLeft: padding - 6 }}>
                Current Password
              </Text>
              <TextInput
                onChangeText={val => setCurrentPassword(val)}
                style={{
                  fontSize: padding - 4,
                  borderBottomColor: 'rgba(0,0,0,0.4)',
                  marginHorizontal: 18,
                  borderBottomWidth: 1,
                }}
              />
            </>
          ) : (
            <></>
          )}
        </View>
        <View>
          <Text style={{ marginTop: padding - 6, marginLeft: padding - 6 }}>
            New Password
          </Text>
          <TextInput
            onChangeText={val => setPassword(val)}
            style={{
              fontSize: padding - 4,
              borderBottomColor: 'rgba(0,0,0,0.4)',
              marginHorizontal: 18,
              borderBottomWidth: 1,
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        style={{
          height: height / 2,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        visible={visible}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '50%',
          }}>
          <Text style={{ fontWeight: '700', fontSize: height / 18 }}>
            Uploading
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: height / 28,
              alignSelf: 'center',
              marginTop: 24,
            }}>
            {transferred} %
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#333333',
  },
});
export default EditRoomDetails;
