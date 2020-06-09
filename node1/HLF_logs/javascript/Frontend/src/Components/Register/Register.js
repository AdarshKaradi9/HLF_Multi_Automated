import React from 'react';
import './Register.css';
import '../../fonts/material-icon/css/material-design-iconic-font.min.css';
import '../../css/style.css';
class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                username: '',
                password: '',
                email: '',
                type: '',
            },
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit =  (e) => {
        const { username, password, type} = this.state.user;
        if ( username==='' || password===''  || type==='') {
            alert("Fill all the entries");
            this.props.onRouteChange('register');
        }
        else {
            const ip = process.env.REACT_APP_IP
            e.preventDefault();
            this.setState({ submitted: true });
            fetch(`http://${ip}:3001/register`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: this.state.user.username,
                    password: this.state.user.password,
                    type: this.state.user.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.resStatus === 'success') {
                    alert(`${this.state.user.username} successfully registered to the network`);
                    this.props.onRouteChange('signin');
                } else {
                    alert('Failed to register : User already exists');
                    this.props.onRouteChange('register');
                }
            })
        }
        
    }


    render() {
        const { username, password, submitted,type,user } = this.state;
        return(
            
            <div className="main">
               
        <section className="signup">
            <div className="container">
                <div className="signup-content">
                    <form id="signup-form" className="signup-form">
                        <h2 className="form-title">Create account</h2>
                        <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                            <input type="text" className="form-input" name="username" id="name" value={user.username} onChange={this.handleChange} placeholder="Username"/>
                            {submitted && !user.username &&
                            <div className="help-block">Username is required</div>
                        }
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <input type="password" className="form-input" name="password" id="password" value={user.password} onChange={this.handleChange} placeholder="Password"/>
                            {submitted && !user.username &&
                            <div className="help-block">Password is required</div>
                        }
                        </div>
                        <div className={'form-group' + (submitted && !type ? ' has-error' : '')}>
                            <input type="text" className="form-input" name="type" id="type" value={user.type} onChange={this.handleChange} placeholder="Type"/>
                            {submitted && !user.type &&
                            <div className="help-block">Type is required</div>
                        }
                        </div>
                        <div className="form-group">
                            <input type="submit" name="submit" id="submit" className="form-submit" onClick={this.handleSubmit} value="Sign up"/>
                        </div>
                    </form>
                    <div className="form-group">
                            Already have an account ? <strong><a id="buttonReg" onClick={()=> {this.props.onRouteChange('signin')}} >Sign in</a></strong>
                        </div>
                </div>
            </div>
        </section>

    </div>
        );
    }
}

export default Register;
