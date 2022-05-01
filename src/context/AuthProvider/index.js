import React from 'react';
import {AuthContext} from '../AuthContext';
import auth from '@react-native-firebase/auth';

export const AuthProvider = ({children}) => {
  let [user, setUser] = React.useState(null);

  function isLoggedIn() {
    auth().onAuthStateChanged(FirebaseUser => {
      if (FirebaseUser) {
        setUser(FirebaseUser);
      }
    });
  }

  React.useEffect(() => {
    isLoggedIn();
  });

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
