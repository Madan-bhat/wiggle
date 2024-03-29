/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

import {
  ImageBackground,
  FlatList,
  Alert,
  Image,
  Text,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { width, height } from '../../../constants/Dimesions/index';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ImageCropPicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { EncryptData } from '../../../functions';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { ImageView } from '../../../components';
import MessageCard from '../../../components/Cards/MessageCard';
import { ActivityIndicator } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import {
  GiftedChat,
  Bubble,
  Actions,
  MessageImage,
  Send,
} from 'react-native-gifted-chat';

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
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 4,
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

export default function Chat(props) {
  let [image, setImage] = useState('');
  let [state, setUserData] = useState();
  let [loading, setLoading] = useState(true);
  let [transferred, setTransferred] = useState();
  let [visible, setVisible] = useState();

  let [userForToken, setUserForToken] = useState([]);
  let [messageText, setMessageText] = useState('');
  let [messages, setMessages] = useState([]);

  let MessageFormat = {
    createdAt: Date.now(),
    messageText: EncryptData(messageText),
    image: image ? image : null,
    uid: auth().currentUser.uid,
  };

  let fetchMessages = useCallback(async () => {
    try {
      await firestore()
        .collection('groups')
        .doc(props.route.params.id)
        .collection('Messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(_val => {
          let allMsg = _val.docs.map(_data => {
            return _data.data();
          });
          setMessages(allMsg);
        });
    } catch (e) {}
  }, [props.route.params.id]);

  function groupedDays(messages) {
    return messages.reduce((acc, el, i) => {
      const messageDay = moment(el.created_at).format('YYYY-MM-DD');
      if (acc[messageDay]) {
        return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
      }
      return { ...acc, [messageDay]: [el] };
    }, {});
  }

  function generateItems(messages) {
    const days = groupedDays(messages);
    const sortedDays = Object.keys(days).sort(
      (x, y) => moment(y, 'YYYY-MM-DD').unix() - moment(x, 'YYYY-MM-DD').unix(),
    );
    const items = sortedDays.reduce((acc, date) => {
      const sortedMessages = days[date].sort(
        (x, y) => new Date(y.created_at) - new Date(x.created_at),
      );
      return acc.concat([...sortedMessages, { type: 'day', date, id: date }]);
    }, []);
    let Lists = [];
    Lists.push(items);
    // setMessages(Lists);
  }

  let getUser = useCallback(async () => {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .get()
        .then(_userData => {
          setUserData(_userData.data());
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    console.log(generateItems);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    fetchMessages();
  }, [fetchMessages, props.route.params.id]);

  useEffect(() => {
    getUser();
    props.route.params.item.members.map(async item => {
      await firestore()
        .collection('users')
        .doc(item)
        .get()
        .then(__val => {
          let Lists = [];
          let { token } = __val.data();
          Lists.push(token);
          setUserForToken(Lists);
        });
    });
  }, [getUser, props.route.params.item.members, props.route.params.members]);

  let sendMessage = async () => {
    const mymsg = {
      text: messageText ? messageText : null,
      sentBy: auth().currentUser.uid,
      image: image || null,
      createdAt: Date.now(),
      user: {
        _id: `${auth().currentUser.uid}`,
      },
    };
    // // const currentMessages = await AsyncStorage.getItem(
    // //   `${props.route.params.id}/messages`,
    // // );
    // // const messageArray = JSON.parse(currentMessages);
    // // messageArray.push(MessageFormat);
    // // await AsyncStorage.setItem(
    // //   `${props.route.params.id}/messages`,
    // //   JSON.stringify(messageArray),
    // messages.push(...messages, MessageFormat);

    // );

    try {
      firestore()
        .collection('groups')
        .doc(props.route.params.id)
        .collection('Messages')
        .add({
          ...mymsg,
          // createdAt: Date.now(),
          // messageText: EncryptData(messageText),
          // image: image ? image : null,
          // user: {
          //   _id: `${auth().currentUser.uid}`,
          // },
          // uid: auth().currentUser.uid,
        })
        .then(() => sendPushNotification())
        .catch(e => console.log(e));
      setMessageText('');
      setImage('');
      bs.current.snapTo(1);
    } catch (e) {
      Alert.alert(e);
    }
  };

  const sendPushNotification = async () => {
    const FIREBASE_API_KEY =
      'AAAAjqJY0zI:APA91bFf3LXAnyDmGHgTUNKhjVoKzEpbjDeRkOQOXqDs3OB2j2FEYZduHluuyqdD0Ul9qtCPMcB9Cc3uAClcwjR6RK0gZFuF2YVpOAmvSsWIlAecIENsh92oXpCuvqiqG6z2vdouGqah';
    const message = {
      registration_ids: userForToken,
      notification: {
        title: props.route.params.headerTitle,
        body: messageText,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    try {
      let response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });
      response = await response.json();
      console.log('response ', response);
    } catch (error) {
      console.log('error ', error);
    }
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 1080,
      height: 2000,
    }).then(image => {
      setMessageImageUri(image.path);
    });
  };

  function renderActions(props) {
    return (
      <Actions
        {...props}
        options={{
          ['Pick Image From Library']: choosePhotoFromLibrary,
          ['Camera']: openCamera,
        }}
        icon={() => <AntDesign name={'camera'} size={28} color={'black'} />}
        onSend={args => onSend(args)}
      />
    );
  }

  const onSend = () => {
    const mymsg = {
      text: messageText ? messageText : null,
      sentBy: auth().currentUser.uid,
      sentTo: props.params.uid,
      image: image || null,
      time: moment().format('hh:mm A'),
      createdAt: new Date(),
      user: {
        _id: `${auth().currentUser.uid}`,
      },
    };
    const docid =
      props.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + '-' + props.params.uid
        : props.params.uid + '-' + auth().currentUser.uid;
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({
        ...mymsg,
        token: 'something',
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        sendPushNotification();
        setMessageImageUri(null);
        setMessageImage(null);
      });
    setText('');
    setMessageImage(null);
  };

  let flatlistRef = useRef();

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: true,
    }).then(image_data => {
      setImage(`data:image/jpeg;base64,${image_data.data}`);
      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = async () => {
    await ImageCropPicker.openPicker({
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: true,
    }).then(image_data => {
      setImage(`data:image/jpeg;base64,${image_data.data}`);
      bs.current.snapTo(1);
    });
  };

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
          source={require('../../../../assets/Dania.jpg')}
          style={styles.panelButton}>
          <View
            style={styles.panelButton}
            onPress={() => takePhotoFromCamera()}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </View>
        </ImageBackground>
        <TouchableOpacity onPress={choosePhotoFromLibrary}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../assets/Dania.jpg')}
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
            source={require('../../../../assets/Dania.jpg')}
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
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View
            style={{
              padding: 8,
              backgroundColor: '#FFF',
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}>
            <AntDesign
              onPress={() => props.navigation.goBack()}
              name="arrowleft"
              style={{ marginHorizontal: 8 }}
              size={24}
              color="black"
            />
            <Image
              source={{
                uri: props.route.params.item.groupImage
                  ? props.route.params.item.groupImage
                  : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
              }}
              style={{
                width: 36,
                marginRight: 8,
                borderRadius: 80,
                height: 36,
              }}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                props.navigation.navigate('photogram.chatDetails.screen', {
                  item: props.route.params.item,
                  route: props.route,
                })
              }>
              <Text style={{ fontFamily: 'Lato-Bold' }}>
                {props.route.params.headerTitle}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                }}>{`${props.route.params.item.members.length} members`}</Text>
            </TouchableOpacity>
          </View>
          <Modal
            style={{ justifyContent: 'center', display: 'flex' }}
            visible={image ? true : false}>
            <View style={{ justifyContent: 'center', flex: 1 }}>
              <Ionicons
                onPress={() => {
                  setImage(null);
                  setMessageText('');
                }}
                style={{ top: 3, left: 3, position: 'absolute' }}
                name="close"
                size={24}
                color="black"
              />
              <Image
                source={{ uri: image }}
                style={{ height: height / 3, width }}
              />
              <TextInput
                placeholderTextColor="#000"
                style={{ color: '#000', fontFamily: 'Lato-Regular' }}
                width={width}
                placeholder="Type the message here ....."
                onChangeText={_val => {
                  setMessageText(_val);
                }}
              />
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 8 }}
                onPress={sendMessage}
                disabled={
                  messageText.replace(/\s/g, '').length === 0 ? false : false
                }>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                    color: '#45A4FF',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <BottomSheet
            ref={bs}
            snapPoints={[330, -5]}
            renderContent={renderInner}
            renderHeader={renderHeader}
            initialSnap={1}
            callbackNode={fall}
            enabledGestureInteraction={true}
          />
          <GiftedChat
            onInputTextChanged={text => setMessageText(text)}
            renderSend={props => (
              <Send {...props} disabled={image || messageText ? false : true} />
            )}
            renderMessageImage={props => {
              return (
                <MessageImage
                  {...props}
                  imageStyle={{ width: width / 1.2, height: height / 4.5 }}
                />
              );
            }}
            messages={messages}
            renderActions={renderActions}
            renderBubble={props => {
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: {
                      backgroundColor: '#229AC9',
                    },
                    left: {
                      backgroundColor: '#DFDFDF',
                    },
                  }}
                />
              );
            }}
            user={{
              _id: auth().currentUser.uid,
            }}
            onSend={messages => sendMessage(messages)}
          />
          {/* <FlashList
              scrollEventThrottle={100}
              ref={flatlistRef}
              style={{
                marginBottom: 12,
                flex: 1,
                flexDirection: 'column',
              }}
              estimatedItemSize={50}
              onContentSizeChange={() => {
                flatlistRef.current.scrollToEnd({ animated: true });
              }}
              data={messages}
              renderItem={({ item, index }) => {
                return (
                  <MessageCard item={item} navigation={props.navigation} />
                );
              }}
            />
          </View>

          <View
            style={{
              backgroundColor: '#FFF',
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              width: width,
            }}>
            <Ionicons
              onPress={() => bs.current.snapTo(0)}
              style={{ marginHorizontal: 6 }}
              name="images"
              size={24}
              color="black"
            />

            <TextInput
              placeholderTextColor="#000"
              value={messageText}
              onChangeText={_message_text => {
                setMessageText(_message_text);
              }}
              placeholder={'Type the message here ......'}
              style={{
                padding: 12,
                color: '#000',
                width: '82%',
                fontFamily: 'Lato-Regular',
                backgroundColor: '#FFF',
                bottom: 0,
                zIndex: 100,
              }}
            />

            <TouchableOpacity
              onPress={sendMessage}
              disabled={
                messageText.replace(/\s/g, '').length === 0 ? true : false
              }>
              <Text style={{ fontFamily: 'Lato-Regular' }}>Send</Text>
            </TouchableOpacity> */}
        </>
      )}
    </>
  );
}
