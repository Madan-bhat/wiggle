import React, {useState, useEffect, memo} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

function EditProfile(props, {navigation}) {
  let padding = 24;
  let {height} = Dimensions.get('window');
  const [imageUri, setImageUri] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [updating, setupdating] = useState(false);
  const [web, setWeb] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState('');
  const [nickname, setNickName] = useState('');

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 700,
      height: 700,
      cropping: true,
    }).then(image => {
      const imageUri = image.path;
      setImageUri(imageUri);

      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImageUri(image.path);

      bs.current.snapTo(1);
    });
  };

  const getUser = () => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnaphot => {
        if (documentSnaphot.exists) {
          setUserData(documentSnaphot.data());
        }
      });
  };
  useEffect(() => {
    const cleanUp = getUser();
    let userName = firstName + ' ' + lastName;
    setNickName(userName.replace(/\s/g, ''));
    return () => cleanUp;
  }, []);
  useEffect(() => {});

  const onUpdate = async () => {
    if (
      (firstName.length < 3 && lastName.length === 0, nickname.length === 3)
    ) {
      Alert.alert('Username should be atleast 3 charactors');
    } else {
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          userName: firstName + ' ' + lastName,
          nickname,
          userImg: imageUrl || null,
          uid: auth().currentUser.uid,
          createdAt: Date.now(),
          bio,
          web,
        })
        .then(() => {
          setupdating(false);
        });
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Choose a image', 'Please choose a image to continue');
    } else {
      setUploading(true);
      const path = `profile/${auth().currentUser.uid + Date.now()}}`;
      return new Promise(async (resolve, rej) => {
        const response = await fetch(imageUri);
        const file = await response.blob();
        let upload = storage().ref(path).put(file);
        upload.on(
          'state_changed',
          snapshot => {
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
            setVisible(true);
          },

          err => {
            rej(err);
          },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL();
            setImageUrl(url);
            resolve(url);
            setVisible(false);
            setImageUri(null);
            setUploading(false);
            return url;
          },
        );
      });
    }
  };

  let renderInner = () => {
    return (
      <View style={styles.panel}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
          <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={takePhotoFromCamera}>
          <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={choosePhotoFromLibrary}>
          <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => bs.current.snapTo(1)}>
          <Text style={styles.panelButtonTitle}>Cancel</Text>
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
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View style={{backgroundColor: '#FFF', padding: padding - 4}}>
        <SafeAreaView
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
          style={{alignSelf: 'center'}}
          onPress={() => bs.current.snapTo(0)}>
          <ImageBackground
            source={{
              uri: imageUri
                ? imageUri
                : userData
                ? userData.userImg ||
                  'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
            }}
            style={{height: 100, width: 100}}
            imageStyle={{borderRadius: 15}}>
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
        <TouchableOpacity onPress={() => uploadImage()}>
          <Text
            style={{
              fontSize: padding - 6,
              color: '#128EF2',
              marginTop: '3%',
              alignSelf: 'center',
            }}>
            {'Set this as profile photo'}
          </Text>
        </TouchableOpacity>
        {/* Main */}
        <View style={{marginTop: padding + 6}}>
          <View>
            <Text style={{marginLeft: padding - 6}}>First Name</Text>
            <TextInput
              onChangeText={val => setFirstName(val)}
              style={{
                fontSize: padding - 4,
                borderBottomColor: 'rgba(0,0,0,0.4)',
                marginHorizontal: 18,
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{marginVertical: padding}}>
            <Text style={{marginLeft: padding - 6}}>Last Name</Text>
            <TextInput
              onChangeText={val => setLastName(val)}
              style={{
                fontSize: padding - 4,
                borderBottomColor: 'rgba(0,0,0,0.4)',
                marginHorizontal: 18,
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: padding}}>
          <Text style={{marginLeft: padding - 6}}>website</Text>
          <TextInput
            onChangeText={val => setWeb(val)}
            style={{
              fontSize: padding - 4,
              borderBottomColor: 'rgba(0,0,0,0.4)',
              marginHorizontal: 18,
              borderBottomWidth: 1,
            }}
          />
        </View>
        <View>
          <Text style={{marginLeft: padding - 6}}>Bio</Text>
          <TextInput
            onChangeText={val => setBio(val)}
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
          <Text style={{fontWeight: '700', fontSize: height / 18}}>
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
    shadowOffset: {width: -1, height: -3},
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
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#45A4F9',
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
export default EditProfile;
