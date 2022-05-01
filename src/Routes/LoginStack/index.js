import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Login, Loading, Register} from '../../screens';

export default function LoginStack() {
  let LoginStackScreen = createNativeStackNavigator();
  return (
    <LoginStackScreen.Navigator>
      <LoginStackScreen.Screen
        name="photogram.loading.screen"
        component={Loading}
      />
      <LoginStackScreen.Screen
        name="photogram.login.screen"
        component={Login}
      />
      <LoginStack.Screen
        name="photogram.register.screen"
        component={Register}
      />
    </LoginStackScreen.Navigator>
  );
}
