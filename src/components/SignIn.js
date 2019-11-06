import React, { Component }  from 'react';
import PropTypes from 'prop-types';
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
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading';
import { Grid, AppBar, Toolbar } from '@material-ui/core';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class SignIn extends Component { 

  constructor(props) {
		console.log(props)
    super(props);
    this.state = {
      isLoading: true
    }
	}
  handleLogin = e => {
    let _email, _password;
    _email = $('#email').val();
   _password = $('#password').val();
    e.preventDefault();
    this.setState({
      isLoading : true
    })
    this.props.loginUser(_email, _password);
    console.log(_email)
  };
  render() {
    const responseGoogle = (response) => {
      console.log(response);
    }
    const responseFacebook = (response) => {
      console.log(response);
    }
  return (
    <React.Fragment> 
    <main className={this.props.classes.main}>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={this.props.classes.appBar}>
        <Toolbar style={{'display':'flex','justifyContent':'center'}}>
          <Typography variant="h4" color="primary" noWrap >
            Sign in
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper className={this.props.classes.paper} >
        <Avatar className={this.props.classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={this.props.classes.form} onSubmit={this.handleLogin}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={this.props.classes.submit}
          >
           
            {this.state.isLoading ? ' Sign in':'Loadingâ¦' }
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={this.props.classes.submit}
          >
          Sign up
         
            
          </Button>
        </form>
        <Grid container spacing={12}>
          <Grid item xs={12}>
            <GoogleLogin
              clientId="700207001787-jhdc1dimgk89ej6qk8avog6811hb30el.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
          </Grid>
          <Grid item xs={12} style={{'marginTop':'10px'}}>
            <FacebookLogin
              appId="307164699984573"
              autoLoad={true}
              textButton='FaceBook'
              fields="name,email,picture"
              callback={responseFacebook} 
            />
          </Grid>
        </Grid>
       
      </Paper>
    
    </main>
    </React.Fragment>
    
  );
}
}



SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);

