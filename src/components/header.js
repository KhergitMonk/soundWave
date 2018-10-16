import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../actions/user";
import sWLogo from "../../assets/sound_wave-512.png";
import settings from '../settings/index';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const token = sessionStorage.getItem("jwtToken");
    if (!token || token === "") {
      this.props.setUserData({ loggedIn: false });
      return;
    }

    axios
      .post(settings.NodeServerRootAddr + "/validate_token", { token: token })
      .then(response => {
        if (response.data.tokenValid === true) {
          this.props.setUserData({
            loggedIn: true,
            username: response.data.username,
            myMusic: response.data.myMusic
          });
        } else {
          this.props.setUserData({ loggedIn: false });
        }
      });
  }

  logOut() {
    sessionStorage.removeItem("jwtToken");
    this.props.setUserData({ loggedIn: false, username: "" });
  }

  getAccountButtons() {
    let accountButtons = '';

    if (this.props.user.loggedIn === false) {
      accountButtons = (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/login">
              <span className="badge badge-pill badge-light p-2 pl-3 pr-3">
                Login
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup">
              <span className="badge badge-pill badge-light p-2 pl-3 pr-3">
                Sign up
              </span>
            </Link>
          </li>
        </ul>
      )
    } 

    if (this.props.user.loggedIn === true) {
      accountButtons = (
        <ul className="navbar-nav ml-auto">
          <div className="greeting">
            Logged in as <strong>{this.props.user.username}</strong>
          </div>
          <li className="nav-item">
            <Link to="/mymusic">
              <span className="badge badge-pill badge-light p-2 pl-3 pr-3">
                My music
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" onClick={this.logOut.bind(this)}>
              <span className="badge badge-pill badge-light p-2 pl-3 pr-3">
                Log out
              </span>
            </Link>
          </li>
        </ul>
      )
    }

    return accountButtons; //this will be empty in case of loggedIn = 'pending'
  }

  render() {
    return (
      <nav className="navbar navbar-dark header">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src={sWLogo}
              width="30"
              height="30"
              className="d-inline-block align-top sw-logo"
              alt=""
            />
            soundWave
          </Link>
          { this.getAccountButtons() }
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { setUserData }
)(Header);
