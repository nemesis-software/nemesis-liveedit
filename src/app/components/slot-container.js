import React, { Component } from 'react';
import SlotService from '../services/slot-service';
import ConsolePopup from './backend-console-popup';

export default class SlotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false};
  }

  render() {
    return (
      <div style={this.getStyles()} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
        <div onClick={this.handleClickSlotMenu.bind(this)} style={{position: 'absolute', top: '0', left: '0', background: 'blue', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px'}}>more_horiz</i>
        </div>
        <ConsolePopup open={this.state.openBackendConsolePopup}
                      entityId="cms_slot"
                      entityName="cms_slot"
                      itemId={this.props.data.id}
                      onClose={() => this.setState({...this.state, openBackendConsolePopup: false})} />
      </div>
    );
  }

  handleDragover(event) {
    event.preventDefault();
  }

  handleClickSlotMenu() {
    if (this.state.openBackendConsolePopup) {
      return;
    }

    this.setState({openBackendConsolePopup: true})
  }

  handleDrop(event) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData("itemData"));
    if (data.slotId === this.props.data.id) {
      return;
    }

    let actionPromise = null;
    if (!data.slotId) {
      actionPromise = SlotService.addWidgetToSlot(this.props.data.id, data.id)
    } else {
      actionPromise = SlotService.changeWidgetSlot(data.slotId, this.props.data.id, data.id);
    }

    actionPromise.then(result => {
      window.location.reload();
    }, err => console.log(err));
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