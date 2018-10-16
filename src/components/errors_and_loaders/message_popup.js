import React, { Component } from 'react';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; 
import { setMessage } from '../../actions/user';

class MessagePopup extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {

    if ((this.props.message.message !== '') && (this.props.message.type !== '')) {

      let title = '';
      if (this.props.message.type === 'Error') {
        title = 'Error'
      }

      confirmAlert({
        title: title,
        message: this.props.message.message,
        buttons: [
          {
            label: 'OK',
            onClick: () => this.props.setMessage('', '')
          }
        ]
      })
    }

  }
  
  render() {
    return (
      <div></div>
    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.user.message
  }
}

export default connect(mapStateToProps, { setMessage })(MessagePopup);

