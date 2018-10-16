import React, { Component } from 'react';
import tempImg from '../../../assets/loader.png';

/* Recives following props

maxWidth
maxHeight
classes
src
alt

*/

class ImgWithPreloader extends Component {
  constructor(props) {
    super(props);

    this.imgStyle = { 
      maxWidth: this.props.maxWidth ? this.props.maxWidth+'px' : '100%', 
      maxHeight: this.props.maxHeight ? this.props.maxHeight+'px' : 'auto', 
      height: 'auto',
      width: '100%' };

    this.state = { imgLoaded: false }
  }

  returnImg() {
    if (!this.props.src) {
      return <img className={'mr-3 search-result-preloader ' + this.props.classes} 
      style={this.imgStyle} src={tempImg} alt="no image"/>
    }
    


    return (
      <img className={this.props.classes} src={this.props.src} alt={this.props.alt} 
      style={ !this.state.imgLoaded ? {...this.imgStyle, display: 'none'} : this.imgStyle } 
      onLoad={ !this.state.imgLoaded ? () => {this.setState({ imgLoaded: true })} : null}/>
    )
  }

  returnPreloader() {
    if ((this.state.imgLoaded === true) ||  (!this.props.src)) {
      return null;
    }

    return (
      <img className={'mr-3 search-result-preloader animated-pulse pulse ' + this.props.classes} 
      src={tempImg} style={this.imgStyle} alt="Preloader"/>
    )
  }

  render() {
    return (
      <div className="img-with-preloader">
        { this.returnPreloader() }
        { this.returnImg() }
      </div>
    );
  }
}


export default ImgWithPreloader; 