import React from 'react';
import { View, Text } from 'react-native';

export default function Settings() {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
        I am the only developer 😊
      </Text>
    </View>
  );
}
