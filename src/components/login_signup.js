import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Text } from "informed";
import history from '../modules/history';
import axios from 'axios';
import warningImg from '../../assets/warning.png';
import successImg from '../../assets/success.png';
import { connect } from 'react-redux';
import { setUserData } from '../actions/user';
import settings from '../settings/index';

class LoginSignup extends Component {
  constructor(props) {
    super(props); 

    this.redirectTimerID = null;
    this.formApi = null;
    this.state = { serverErrorMsg: null, submitSuccess: false, submitSuccessMessage: '' }
  }

  componentDidUpdate(nextProps) {
    if (this.props.loginOrSignup !== nextProps.loginOrSignup) {
      this.setState({ serverErrorMsg: null, submitSuccess: false })
      this.formApi.reset();
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(String(email).toLowerCase());
    if ((!email) || (!emailValid)) {
      return true;
    } else {
      return null;
    }
  }

  validatePassword(password) {
    if ((!password) || (password.length < 7)) {
      return true;
    }
    return null;
  }

  validateUsername(username) {
    if ((!username) || (username.length < 3)) {
      return true;
    }
    return null;
  }

  handleFormSubmit(values) {
    
    if (this.props.loginOrSignup === 'signup') {
      axios.post(settings.NodeServerRootAddr + '/signup',{ 
          username: values.username, 
          email: values.email, 
          password: values.password })
        .then((response) => {
        if (response.data.error) {
          this.setState({ serverErrorMsg: response.data.error, submitSuccess: false, submitSuccessMessage: '' })
        } else {
          this.setState({ 
            serverErrorMsg: null, 
            submitSuccess: true, 
            submitSuccessMessage: <span>User created successfully. You can now <Link to='/login'>login</Link> to your account</span> })
          this.formApi.reset();
        }
      });
    }

    if (this.props.loginOrSignup === 'login') {
      axios.post(settings.NodeServerRootAddr + '/login',{ email: values.email, password: values.password }).then((response) => {
        if (response.data.error) {
          this.setState({ serverErrorMsg: response.data.error, submitSuccess: false, submitSuccessMessage: '' })
        } else {
          sessionStorage.setItem('jwtToken', response.data.token);
          this.setState({ 
            serverErrorMsg: null, 
            submitSuccess: true, 
            submitSuccessMessage: 'Login successfull. You will be redirected to main page now...' })
          
          this.props.setUserData({ loggedIn: true, username: response.data.username, myMusic: response.data.myMusic  })
          
          this.redirectTimerID = setTimeout(() => { history.push('/') }, 2000);
        }
      });
    }

    
  }

  componentWillUnmount() {
    clearTimeout(this.redirectTimerID);
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  render() {
    return (
      <div className="card login-signup-form-wrapper">
        <h5>{ this.props.loginOrSignup === 'login' ? 'Login' : 'Sign up' }</h5>
        <hr/>
        <Form onSubmit={(values) => {this.handleFormSubmit(values)}} getApi={this.setFormApi.bind(this)}>
        {({ formState }) => (
          <div>
            {(this.state.serverErrorMsg) ? 
              <div className="alert alert-danger login-signup-form-validation-msg">
              <img src={warningImg}/> {this.state.serverErrorMsg} </div> 
              : null} 
            {(this.state.submitSuccess) ? 
              <div className="alert alert-success login-signup-form-validation-msg">
              <img src={successImg}/> {this.state.submitSuccessMessage} </div> 
              : null} 

            { this.props.loginOrSignup === 'signup' ? 
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Text field="username" type="text" className="form-control" id="username" 
              placeholder="Username" validateOnChange validate={this.validateUsername}/>
              {(formState.touched.username && formState.errors.username) ? 
                <div className="alert alert-danger login-signup-form-validation-msg">
                <img src={warningImg}/> Invalid username - username need to be at least 3 characters long </div> 
                : null} 
            </div>
            : null }

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Text field="email" type="text" className="form-control" id="email" 
              placeholder="Email" validateOnChange validate={this.validateEmail}/>
              {(formState.touched.email && formState.errors.email) ? 
                <div className="alert alert-danger login-signup-form-validation-msg">
                <img src={warningImg}/> Please provide a valid email address </div> 
                : null} 
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Text field="password" type="password" className="form-control" id="password" 
              placeholder="Password" validateOnChange validate={this.validatePassword}/>
              {(formState.touched.password && formState.errors.password) ? 
                <div className="alert alert-danger login-signup-form-validation-msg">
                <img src={warningImg}/> Invalid password - password need to be at least 7 characters long </div> 
                : null} 
            </div>

            <button className="btn btn-success float-right mt-4" type="submit">
              { this.props.loginOrSignup === 'login' ? 'Login' : 'Sign up' }
            </button>
          </div>
        )}
        </Form>
      </div>
    );
  }
}

export default connect(null, { setUserData })(LoginSignup);
