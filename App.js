/* eslint-disable react-native/no-inline-styles */
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import codePush from 'react-native-code-push';
import { DrawerContent, ImageView } from './src/components';
import {
  CreateRoom as CreateScreen,
  JoinRoom as JoinScreen,
  Launch as Groups,
  Loading,
  Login,
  Profile,
  Register,
  Search,
  Settings,
  Chat,
  Support,
  RoomDetail,
  Users,
  Password,
  EditProfile,
  EditRoomDetails,
  Chats,
  ChatRoom,
} from './src/screens';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';
import { AuthContext } from './src/context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ForgotPassword } from './src/screens/Auth';
import UserList from './src/screens/Dashboard/UserList';

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

function App() {
  let [user, setUser] = useState();
  let [userData, setUserData] = useState();

  let Stack = createNativeStackNavigator();
  let MainDrawerStack = createDrawerNavigator();
  const Tab = createMaterialTopTabNavigator();

  function LaunchScreen() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { marginTop: 10, marginHorizontal: 18, elevation: 0 },
        }}
        style={{ marginBottom: 25, backgroundColor: '#fff', elevation: 0 }}>
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Groups" component={Groups} />
      </Tab.Navigator>
    );
  }

  let DashBoard = () => {
    return (
      <AuthContext.Provider>
        <MainDrawerStack.Navigator
          drawerContent={props => <DrawerContent {...props} />}>
          <MainDrawerStack.Screen
            name="photogram.launch.screen"
            options={{
              headerStyle: { height: 100 },
              title: (
                <Text style={{ fontFamily: 'Lato-Bold', fontSize: 60 }}>
                  {'Wiggle'}
                </Text>
              ),
              headerShown: true,
            }}
            component={LaunchScreen}
          />
          <MainDrawerStack.Screen
            name="photogram.search.screen"
            options={{ title: 'Photogram' }}
            component={Search}
          />
          <MainDrawerStack.Screen
            options={{ headerShown: false, title: 'Photogram' }}
            name="photogram.profile.screen"
            component={Profile}
          />
          <MainDrawerStack.Screen
            options={{ headerShown: false, title: 'Photogram' }}
            name="photogram.settings.screen"
            component={Settings}
          />
          <MainDrawerStack.Screen
            options={{ headerShown: false, title: 'Photogram' }}
            name="photogram.support.screen"
            component={Support}
          />
        </MainDrawerStack.Navigator>
      </AuthContext.Provider>
    );
  };

  React.useEffect(() => {
    // eslint-disable-next-line no-shadow
    auth().onAuthStateChanged(user => {
      if (user) {
        firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(userDataFromFirestore => {
            setUserData(userDataFromFirestore.data());
          });
        setUser(user);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.loading.screen"
            component={Loading}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.login.screen"
            component={Login}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.forgot.password.screen"
            component={ForgotPassword}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.register.screen"
            component={Register}
          />
          <Stack.Screen
            options={{ headerShown: false, title: 'Photogram' }}
            name="photogram.dashboard.screen"
            component={DashBoard}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              title: 'Join Room',
              headerTitleAlign: 'center',
              headerLeft: null,
            }}
            name="photogram.join.screen"
            component={JoinScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              title: 'Create Room',
              headerTitleAlign: 'center',
            }}
            name="photogram.create.screen"
            component={CreateScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.chat.screen"
            component={Chat}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.roomdetails.screen"
            component={RoomDetail}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.chatDetails.screen"
            component={RoomDetail}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.users.screen"
            component={Users}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.password.screen"
            component={Password}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.edit.profile.screen"
            component={EditProfile}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.image.view.screen"
            component={ImageView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.edit.group.info.screen"
            component={EditRoomDetails}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.user.list.screen"
            component={UserList}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="photogram.chat.room.screen"
            component={ChatRoom}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default codePush(codePushOptions)(App);
