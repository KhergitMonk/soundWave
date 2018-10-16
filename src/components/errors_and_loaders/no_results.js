import React, { Component } from 'react';
import flatLine from '../../../assets/flat_line.png';

export default function render() {
  return (
    <div className="app-error">
      <img src={flatLine}/>
      <div className="text-big">No results found</div>
    </div>
  )
}