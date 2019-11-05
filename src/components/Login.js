import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';

export default function Login({ firebase }) {
  const style = {
    label: {
      flexDirection: "column"
    }
  };
  const user = firebase.auth().currentUser;
  return (
    <div>
      <Button
        color={user ? "secondary" : "primary" }
        variant="contained"
        autoFocus
        style={style}
          
        onClick={() => {
          if (user)
            firebase.auth().signOut();
          else {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider);
          }
          
        }}
      >
        {user && user.photoURL &&
          <Fragment>
          <img src={user.photoURL} alt={user.displayName} width="50" height="50"></img>
          <br/>
          </Fragment>
        }
        {user ?  'Sign Out' : 'Login' }
        </Button>

    </div>
  );
}
