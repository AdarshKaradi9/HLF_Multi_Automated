import React from 'react';
import './Signin.css'
class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                username: '',
                password: ''
            },
            currentUser: null,
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);

    }


    handleChange(e) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    onSubmitSignIn =  (e) => {
        const { username, password} = this.state.user;
        console.log(username);
        if ( username==='' || password==='') {
            alert("Fill all the entries");
        }
        else {
            e.preventDefault();
            const ip = process.env.REACT_APP_IP;
            console.log(ip);
            this.setState({ submitted: true });
            fetch(`http://${ip}:3001/signin`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: this.state.user.username,
                    password: this.state.user.password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.resStatus === 'success') {
                    console.log(data);
                    this.setState({currentUser: data.userName})
                    this.props.onUser(this.state.currentUser);  
                    this.props.onRouteChange('home');
                }else {
                    console.log(data.userName);
                    alert(`Username does not exists!!`);
                    this.props.onRouteChange('signin');
                }
            })
        }
        
    }


    render() {
        const { username, password ,submitted,user } = this.state;
        return(
            <div className="main">
               
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <form id="signup-form" className="signup-form">
                            <h2 className="form-title">LOG IN</h2>
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
                            <div className="form-group">
                                <input type="submit" name="submit" id="submit" className="form-submit" onClick={this.onSubmitSignIn} value="Sign in"/>
                            </div>
                        </form>
                        <div className="form-group">
                            Don't have an account ? <strong><a id="buttonReg" onClick={()=> {this.props.onRouteChange('register')}} >Register</a></strong>
                        </div>
                    </div>
                </div>
            </section>
    
        </div>
            
            
        );
    }
}

export default Signin;