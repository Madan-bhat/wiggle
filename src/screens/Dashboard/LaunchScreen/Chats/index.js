/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  RefreshControl,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FAB, Portal, Provider } from 'react-native-paper';
import { LaunchCard } from '../../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import BottomSheet from 'reanimated-bottom-sheet';

import { height, width } from '../../../constants';
import Animated from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import ChatList from '../../../../components/Cards/ChatList';

export default function Chats({ navigation }) {
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let getChats = useCallback(() => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(_doc => {
        setChats(_doc.data().Chats);
      });
  });

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
      paddingLeft: 10,
      color: '#333333',
    },
  });

  let renderInner = () => {
    return (
      <View style={styles.panel}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.panelTitle}>Join</Text>
          <Text style={styles.panelSubtitle}>Join or Create a group</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('photogram.create.screen');
            bs.current.snapTo(1);
          }}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../assets/Dania.jpg')}
            style={styles.panelButton}>
            <View style={styles.panelButton}>
              <Text style={styles.panelButtonTitle}>Create</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('photogram.join.screen');
            bs.current.snapTo(1);
          }}>
          <ImageBackground
            imageStyle={{
              borderRadius: 10,
            }}
            source={require('../../../../assets/Dania.jpg')}
            style={styles.panelButton}>
            <View style={styles.panelButton}>
              <Text style={styles.panelButtonTitle}>Join</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  let renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  let bs;
  let fall;
  bs = React.createRef();
  fall = new Animated.Value(1);

  let refreshControl = () => {
    setRefreshing(true);
    fetchChats().then(setRefreshing(false));
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
    getChats();
  }, [getChats]);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: '#FFF',
      }}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, -5]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('photogram.user.list.screen')}>
        <ImageBackground
          imageStyle={{ borderRadius: 100 }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 62,
            top: height - 280,
            left: width - 80,
            height: 62,
          }}
          source={require('../../../../assets/Dania.jpg')}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
            +
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      <FlashList
        estimatedItemSize={50}
        refreshControl={
          <RefreshControl onRefresh={refreshControl} refreshing={refreshing} />
        }
        data={chats}
        renderItem={item => {
          return <ChatList navigation={navigation} item={item} />;
        }}
        style={{ height }}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 18 }}>
              {'You can join a group by pressing + icon'}
            </Text>
          </View>
        )}
        // renderItem={({ item }) => {
        //   return (
        //     // <LaunchCard
        //     //   groupName={item.groupName}
        //     //   navigation={navigation}
        //     //   item={item}
        //     //   groupId={item.id}
        //     // />
        //   // );
        // }}
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
