import React from 'react';
import Button from '@material-ui/core/Button';

export default function LogoutButton({ firebase }) {
  const style = {
    label: {
      flexDirection: "column"
    }
  };
  const user = firebase.auth().currentUser;
  return (
    <div>
      <Button
        color={user ? "secondary" : "primary"}
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
        {user ? 'Sign Out' : 'Login'}
      </Button>

    </div>
  );
}
