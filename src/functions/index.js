import React from 'react';
import CryptoJS from 'react-native-crypto-js';

export function EncryptData(message) {
  return CryptoJS.AES.encrypt(message, '123456').toString();
}

export function DecryptData(message) {
  return CryptoJS.AES.decrypt(message, '123456').toString(CryptoJS.enc.Utf8);
}
