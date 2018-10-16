import React, { Component } from "react";
import flatLine from '../../../assets/flat_line.png';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log('Error from error boundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error">
          <img src={flatLine}/>
          <div className="text-big">
            App crashed, sorry
          </div>
          
        </div>
      )
    }

    return this.props.children;
  }
}