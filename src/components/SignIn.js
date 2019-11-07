import React  from 'react';
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
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid} from '@material-ui/core';
import GoogleButton from 'react-google-button'

const classes = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});


export default function SignIn({ firebase } ){

  const [values, setValues] = React.useState({ name: "", email:"", password:"", passwordConfirmation:"", signUp : false });

  const handleSubmit = () => {
    console.log(`handleSubmit${values}`)
    setValues({ ...values, newText: "", template: "" });
  };

  const handleChange = prop => event => {
    console.log(JSON.stringify(values, null, 2))
    setValues({ ...values, [prop]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
  };

  return (
    <React.Fragment> 
    <main className={classes.main}>
      <CssBaseline />
      
      <Paper className={classes.paper} >
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input onChange={handleChange('email')}id="email" name="email" autoComplete="email" autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input onChange={handleChange('password')}name="password" type="password" id="password" autoComplete="current-password" />
          </FormControl>
            {values.signUp &&
            <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="passwordConfirmation ">Password Confirmation </InputLabel>
            <Input onChange={handleChange('passwordConfirmation ')}name="passwordConfirmation " type="passwordConfirmation " id="passwordConfirmation " autoComplete="current-password" />
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
          >
          {values.signUp ? "Sign Up" : "Sign in"}
          </Button>
          
        </form>
          <Grid
            container
            spacing={1}
            direction="row"
            justify="center"
            alignItems="center">
          <Grid item xs={12} >
            <GoogleButton
              onClick={() => {
                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(googleAuthProvider);
              }}
            />
          </Grid>
         
        </Grid>
       
      </Paper>
    
    </main>
    </React.Fragment>
    
  );
}
