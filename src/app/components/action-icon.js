import React, { Component } from 'react';

export default class ActionIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {position: 'absolute', top: '0', left: '0', background: 'blue', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}
    return (
        <div style={{...style, ...this.props.style}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px',}}>more_horiz</i>
        </div>
    );
  }
}