/* eslint-disable react-native/no-inline-styles */
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {DrawerContent} from './src/components';
import {
  CreateRoom as CreateScreen,
  JoinRoom as JoinScreen,
  Launch,
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
} from './src/screens';
import {Text} from 'react-native';
import {AuthContext} from './src/context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  let [user, setUser] = useState();
  let [userData, setUserData] = useState();
  let Stack = createNativeStackNavigator();
  let MainDrawerStack = createDrawerNavigator();

  let DashBoard = () => {
    return (
      <AuthContext.Provider>
        <MainDrawerStack.Navigator
          drawerContent={props => <DrawerContent {...props} />}>
          <MainDrawerStack.Screen
            name="photogram.launch.screen"
            options={{
              title: <Text style={{fontFamily: 'Lato-Bold'}}>{'Wiggle'}</Text>,
              headerLeft: null,
              headerShown: false,
            }}
            component={Launch}
          />
          <MainDrawerStack.Screen
            name="photogram.search.screen"
            options={{title: 'Photogram'}}
            component={Search}
          />
          <MainDrawerStack.Screen
            options={{headerShown: false, title: 'Photogram'}}
            name="photogram.profile.screen"
            component={Profile}
          />
          <MainDrawerStack.Screen
            options={{headerShown: false, title: 'Photogram'}}
            name="photogram.settings.screen"
            component={Settings}
          />
          <MainDrawerStack.Screen
            options={{headerShown: false, title: 'Photogram'}}
            name="photogram.support.screen"
            component={Support}
          />
        </MainDrawerStack.Navigator>
      </AuthContext.Provider>
    );
  };

  React.useEffect(() => {
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
    <AuthContext.Provider value={{user, userData}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.loading.screen"
            component={Loading}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.login.screen"
            component={Login}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.register.screen"
            component={Register}
          />
          <Stack.Screen
            options={{headerShown: false, title: 'Photogram'}}
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
            options={{headerShown: false}}
            name="photogram.chat.screen"
            component={Chat}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.roomdetails.screen"
            component={RoomDetail}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.chatDetails.screen"
            component={RoomDetail}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.users.screen"
            component={Users}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.password.screen"
            component={Password}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
