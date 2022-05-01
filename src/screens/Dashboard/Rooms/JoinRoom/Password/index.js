import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {width, height} from '../../../../../constants';
import {Base64} from 'js-base64';

const Password = ({route}) => {
  const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45,
    },

    borderStyleHighLighted: {
      borderColor: '#03DAC6',
    },

    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
      borderColor: '#03DAC6',
    },
  });

  useEffect(() => {
    let pass = Base64.decode(route.params.password);
    alert(pass);
  });
  return (
    <View>
      <OTPInputView
        style={{width: '80%', height: 200}}
        pinCount={7}
        autoFocusOnLoad
        keyboardAppearance="default"
        keyboardType="phone-pad"
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          let pass = Base64.decode(route.params.password);
          if (code === pass) {
            Base64;
            alert('password is correct');
          } else {
            alert('password do not match');
          }
        }}
      />
    </View>
  );
};

export default Password;
