import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import logo from "../projectassistantlogo.png";
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

export default class MyNavbar extends Component {
  handleLogOut = async event => {
    event.preventDefault();
    try {
      Auth.signOut();
      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  }
  render() {
    return (
      <div>
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Project Assistant logo"
            />
          </Navbar.Brand>
          <h2 className="App-title">Project Assistant by Continuous Business Change</h2>
          {this.props.auth.isAuthenticated && this.props.auth.user && (
            <p>
              Hello {this.props.auth.user.username}
            </p>
          )}
          <div className="buttons">
            {!this.props.auth.isAuthenticated && (
                <div className="navbar-end">
                <Button  variant="light" >Register</Button>
                <Button variant="light">Login</Button>
              </div>
            )}
            {this.props.auth.isAuthenticated && (
              <Button variant="outline-light">Logout</Button>
            )}
          </div>
        </Navbar>
      </div >
      // <nav className="navbar" role="navigation" aria-label="main navigation">
      //   <div className="navbar-brand">
      //     <a className="navbar-item" href="/">
      //       {/* <img src={logo} className="App-logo" alt="logo" />
      //     <h2 className="App-title">Project Assistant by Continuous Business Change</h2> */}

      //       <img src={logo} width="28" height="28" alt="hexal logo" />
      //     </a>
      //   </div>

      //   <div id="navbarBasicExample" className="navbar-menu">
      //     <div className="navbar-start">
      //       <a href="/" className="navbar-item">
      //         Home
      //       </a>
      //       <a href="/products" className="navbar-item">
      //         Products
      //       </a>
      //       <a href="/admin" className="navbar-item">
      //         Admin
      //       </a>
      //     </div>

      //     <div className="navbar-end">
      //       <div className="navbar-item">
      //         {this.props.auth.isAuthenticated && this.props.auth.user && (
      //           <p>
      //             Hello {this.props.auth.user.username}
      //           </p>
      //         )}
      //         <div className="buttons">
      //           {!this.props.auth.isAuthenticated && (
      //             <div>
      //               <a href="/register" className="button is-primary">
      //                 <strong>Register</strong>
      //               </a>
      //               <a href="/login" className="button is-light">
      //                 Log in
      //               </a>
      //             </div>
      //           )}
      //           {this.props.auth.isAuthenticated && (
      //             <a href="/" onClick={this.handleLogOut} className="button is-light">
      //               Log out
      //             </a>
      //           )}
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </nav> */}
    )
  }
}