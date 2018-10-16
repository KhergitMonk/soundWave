import React from 'react';
import flatLine from '../../../assets/flat_line.png';

export default function render(props) {
  return (
    <div className="app-error">
      <img src={flatLine}/>
      <div className="text-big">Error loading data</div>
      <div className="text-small">{props.error}</div>
    </div>
  )
}