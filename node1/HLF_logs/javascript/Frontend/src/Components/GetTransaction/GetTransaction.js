import React from 'react';
import 'tachyons';
import 'bulma/css/bulma.css';
import { Jumbotron } from 'react-bootstrap';
import {Button} from 'react-bootstrap';

class GetTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           data:null,
           tid: null
        }
        this.onClickingView=this.onClickingView.bind(this);
    }

    onClickingView = async (id) => {  
        const ip = process.env.REACT_APP_IP
        console.log('hd',ip);  
        await fetch(`http://${ip}:3001/viewTransaction`)
      .then(response => response.json())
      .then(data => {
        this.setState({ data })
        this.props.onClickingView({data: this.state.data});
        this.props.onRouteChange('logs');
        });
      
    }

    onInputChange = (event) => {
        this.setState({ tid: event.target.value });
    }

    render() {
        return(
                <Jumbotron>
                    <h1>Welcome to the hyperledger network</h1>
                    <p className='pa4'>Lets you access real-time logs</p>
                    <Button variant='success' onClick={() => this.onClickingView('')}>Click here</Button>
                </Jumbotron>
        );
        
    }
}

export default GetTransaction;
