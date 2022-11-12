import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Image, TextInput, Modal, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import ChatScreenHeader from '../../Components/headers/ChatScreenHeader';
import {
  GiftedChat,
  Bubble,
  Actions,
  MessageImage,
  Send,
} from 'react-native-gifted-chat';
import moment from 'moment';
import { width, height } from '../../Utils/constants/styles';

function chatRoom(props) {
  const [messages, setMessages] = useState([]);
  const [messageImageUri, setMessageImageUri] = useState('');
  const [uploading, setUploading] = useState('');
  const [transferred, setTransferred] = useState('');
  const [messageImage, setMessageImage] = useState('');
  const [text, setText] = useState();
  const [userData, setUserData] = useState();
  const flatListRef = useRef();

  useEffect(() => {
    getUser();
    const docid =
      props.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + '-' + props.params.uid
        : props.params.uid + '-' + auth().currentUser.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
  }, []);

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1080,
      height: 2000,
      cropping: true,
    }).then(image => {
      setMessageImageUri(image.path);
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 1080,
      height: 2000,
    }).then(image => {
      setMessageImageUri(image.path);
    });
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
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
      text: text ? text : null,
      sentBy: auth().currentUser.uid,
      sentTo: props.params.uid,
      image: messageImage || null,
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

  const sendPushNotification = async () => {
    const FIREBASE_API_KEY =
      'AAAA_x7hFhA:APA91bEs3Q-uDXebSY5ZXZwJYRL-23nYtZ0dVdsHEKv3LI6cueK5VLyfmaWpqEObWDg4NXPtOdFWmylNuyRNgdjlMedCL3eI0YsXVZDMeIiQjyFlbIHpSefC-VNId8QMPuTn2qwOQ-Zn';
    const message = {
      to: `${props.params.token}`,
      notification: {
        title: userData ? userData.userName : '',
        body: text,
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

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatScreenHeader
        status={props.params ? props.params.status : 'offline'}
        props={props}
        userName={props.params ? props.params.userName : 'Test'}
        userImg={
          props.params
            ? props.params.userImg
            : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
        }
      />
      <GiftedChat
        onInputTextChanged={text => setText(text)}
        renderSend={props => (
          <Send {...props} disabled={messageImage || text ? false : true} />
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
        onSend={messages => onSend(messages)}
      />

      <Modal visible={messageImageUri ? true : false}>
        <View>
          <Image
            source={{ uri: messageImageUri }}
            style={{ width, height: height / 3 }}
          />
          <TextInput
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              textAlign: 'center',
              width: '90%',
              fontFamily: 'Roboto-Regular',
              marginBottom: 0,
            }}
            value={text}
            onChangeText={content => setText(content)}
          />
          <Button title={'send'} onPress={onSend} />
        </View>
      </Modal>
    </View>
  );
}

export default memo(chatRoom);
