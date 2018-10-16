import React, { Component } from 'react';
import flatLine from '../../../assets/flat_line.png';

export default class FourOFour extends Component {
  render() {
    return (
    <div className="app-error">
      <img src={flatLine}/>
      <div className="text-big">404</div>
      <div className="text-small">Not Found</div>
      <div className="text-small">The resource requested could not be found on the server!</div>
    </div>
    );
  }
}