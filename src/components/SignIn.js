import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import GoogleButton from 'react-google-button'

const classes = makeStyles({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: "12px",
    marginRight: "12px",
    
  },
  paper: {
    marginTop: "4px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `100px 100px 100px`,
  },
  avatar: {
    margin: "4px",
    color: "white",
    backgroundColor:"blue"
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: "4px",
    marginBottom: "4px",
  },
  submit: {
    marginTop: "12px",
  },
});


export default function SignIn({ firebase }) {

  const [values, setValues] = React.useState({ name: "", email: "", password: "", passwordConfirmation: "", signUp: false });

  let isInvalid =
    (values.signUp && (values.password !== values.passwordConfirmation)) ||
    values.password === '' ||
    values.email === '';
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`handleSubmit${JSON.stringify(values, null, 2)}`)
    if (values.signUp) {
      // verify email, password confirmation
      firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
        .then(console.log(`SignIn as ${values.email}`))
        .catch(function (error) {
          console.log(`SignIn createUserWithEmailAndPassword ${error.code}, ${error.message}`);
        });
    }
    else {
      //TODO validate fields. 
      firebase.auth().signInWithEmailAndPassword(values.email, values.password)
        .then(console.log(`SignIn as ${values.email}`))
        .catch(function (error) {
          // Handle Errors here.
          console.log(`SignIn signInWithEmailAndPassword failed ${error.code}, ${error.message}`);
          // ...
        });
    }
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
    isInvalid =
    (values.signUp && (values.password !== values.passwordConfirmation)) ||
    values.password === '' ||
    values.email === '';
    console.log(JSON.stringify(values, null, 2))
  };

  return (
    <React.Fragment>
      <main className={classes.main}>
        <CssBaseline />

        <Paper className={classes.paper}
          style={{   marginLeft: "200px",
            marginRight: "200px",
            display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `100px 100px 100px`, }}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
        </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input onChange={handleChange('email')} id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input onChange={handleChange('password')} name="password" type="password" id="password" autoComplete="current-password" />
            </FormControl>
            {values.signUp &&
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password Confirmation </InputLabel>
                <Input onChange={handleChange('passwordConfirmation')} name="passwordConfirmation " type="password" id="passwordConfirmation " autoComplete="current-password" />
              </FormControl>
            }

            <FormControlLabel
              control={<Checkbox onChange={handleChange('signUp')} value="signUp" color="primary" />}
              label="New User"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled ={isInvalid}
            >
              {values.signUp ? "Sign Up" : "Sign in"}
            </Button>

          </form>
         <br/>
              <GoogleButton
                onClick={() => {
                  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                  firebase.auth().signInWithPopup(googleAuthProvider);
                }}
              />
            

        </Paper>

      </main>
    </React.Fragment>

  );
}
