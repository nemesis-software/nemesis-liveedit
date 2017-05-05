import React, { Component } from 'react';
import SlotService from '../services/slot-service';

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
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData("itemData"));
    if (data.slotId === this.props.data.slotId) {
      return;
    }

    let actionPromise = null;
    if (!data.slotId) {
      actionPromise = SlotService.addWidgetToSlot(this.props.data.slotId, data.id)
    } else {
      actionPromise = SlotService.changeWidgetSlot(data.slotId, this.props.data.slotId, data.id);
    }

    actionPromise.then(result => {
      window.location.reload();
    }, err => console.log(err));
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