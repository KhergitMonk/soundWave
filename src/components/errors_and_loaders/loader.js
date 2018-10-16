import React, { Component } from 'react';
import loader from '../../../assets/loader.png';

export default function render(props) {
  
  let loaderClass = 'loader';
  if (props.absolute) {
    loaderClass = 'loader absolute';
  }
  
  return (
    <div className={loaderClass}>
      <img src={loader} className="animated-pulse pulse"/>
      <div className="loading-text">Loading...</div>
    </div>
  )
}