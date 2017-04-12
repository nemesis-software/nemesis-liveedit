import React, { Component } from 'react';

export default class SlotContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.getStyles()} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
        <div style={{position: 'absolute', top: '0', left: '0', background: 'blue', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer',}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px',}}>more_horiz</i>
        </div>
      </div>
    );
  }

  handleDragover(event) {
    console.log('drag over');
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("itemData"));
    console.log(data, this.props.data.id);
  }

  getStyles() {
    let coordinate = this.props.data.coordinate;
    return {
      position: 'absolute',
      border: '2px dashed blue',
      top: (coordinate.top - 5) + 'px',
      left: (coordinate.left - 5) + 'px',
      width: (coordinate.width + 10) + 'px',
      height: (coordinate.height + 10) + 'px'
    }
  }
}