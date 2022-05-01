/* eslint-disable no-shadow */
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Launch, Search} from '../../screens';

export default function MainStack() {
  let MainDrawerStack = createDrawerNavigator();
  let MainStack = createNativeStackNavigator();

  let DashBoard = () => {
    return (
      <MainDrawerStack.Navigator>
        <MainDrawerStack.Screen
          name="photogram.launch.screen"
          component={Launch}
        />
        <MainDrawerStack.Screen
          name="photogram.search.screen"
          component={Search}
        />
      </MainDrawerStack.Navigator>
    );
  };

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="photogram.dashboard.screen"
        component={DashBoard}
      />
    </MainStack.Navigator>
  );
}
