import React, { Component } from 'react';
import SlotService from '../services/slot-service';
import ConsolePopup from './backend-console-popup';

export default class WidgetContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false, newWidgetData: null}
  }

  render() {
    return (
      <div style={this.getStyles()} draggable="true" onDragStart={this.handleDragStart.bind(this)} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
        {this.state.openBackendConsolePopup ? <ConsolePopup open={this.state.openBackendConsolePopup}
                             newWidgetData={this.state.newWidgetData}
                             onClose={() => this.setState({...this.state, openBackendConsolePopup: false, newWidgetData: null})} />: false}
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

    if (data.id === 'NEMESIS_NEW_WIDGET') {
      this.setState({openBackendConsolePopup: true, newWidgetData: {slotId: data.slotId}});
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
      border: '2px solid blue',
      top: (coordinate.top - 2) + 'px',
      left: (coordinate.left - 2) + 'px',
      width: (coordinate.width + 4) + 'px',
      height: (coordinate.height + 4) + 'px'
    }
  }
}