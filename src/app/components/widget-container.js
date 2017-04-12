import React, { Component } from 'react';

export default class WidgetContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.getStyles()} draggable="true" onDragStart={this.handleDragStart.bind(this)} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
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
    console.log(data, this.props.data.slotId);
  }

  handleDragStart(event) {
    event.dataTransfer.setData("itemData", JSON.stringify({id: this.props.data.id, slotId: this.props.data.slotId}));
  }

  getStyles() {
    let coordinate = this.props.data.coordinate;
    return {
      position: 'absolute',
      border: '1px solid red',
      top: (coordinate.top - 1) + 'px',
      left: (coordinate.left - 1) + 'px',
      width: (coordinate.width + 2) + 'px',
      height: (coordinate.height + 2) + 'px'
    }
  }
}