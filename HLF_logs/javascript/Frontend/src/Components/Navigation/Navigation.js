import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
class Navigation extends React.Component {
    constructor() {
        super();
        this.state = {
            emailChange: null,
            password: null
        }
    }

    onSignOut = async () => {
        const ip = process.env.REACT_APP_IP
        await fetch(`http://${ip}:3001/signout`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              this.props.onUser(null);
              this.props.onRouteChange('signin');
            });
    
        }

    render() {
        const {onRouteChange, isSignedIn, currentUser} = this.props;
        if(isSignedIn) {
            return (
                <Navbar bg="dark" variant="dark">
                <Nav.Link>Signed in as: {currentUser}</Nav.Link>
                <Nav className="mr-auto">
                    <Nav.Link onClick={() => onRouteChange('home')} >Home</Nav.Link>
                </Nav>
                <Nav className='justify-content-right' >
                <Nav.Link onClick={this.onSignOut} >Sign Out</Nav.Link>
                
                </Nav>
                    
                </Navbar>

            );
        }else {
            return (
                <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Log Auditor</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link  ></Nav.Link>
                </Nav>
                <Nav className="justify-content-right">
                    <Nav.Link onClick={() => onRouteChange('signin')} >Sign in</Nav.Link>
                    <Nav.Link onClick={() => onRouteChange('register')} >Register</Nav.Link>
                </Nav>
                </Navbar>
            );
        }
    }
}

export default Navigation;