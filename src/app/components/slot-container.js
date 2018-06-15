import React, { Component } from 'react';
import SlotService from '../services/slot-service';
import ConsolePopup from './backend-console-popup';
import CreateSlotPopup from './create-slot-popup';

export default class SlotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false, openCreateSlotPopup: false, droppedWidgetId: null, oldSlotId: null};
  }

  render() {
    return (
      <div style={this.getStyles()} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
        {this.props.data.id !== 'empty-slot' ? <div onClick={this.handleClickSlotMenu.bind(this)} style={{position: 'absolute', top: '0', left: '0', background: 'red', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px'}}>more_horiz</i>
        </div> : false}
        {this.props.data.isDirty ? <div onClick={this.handleClickSlotMenu.bind(this)} style={{position: 'absolute', top: '-2px', right: '-2px', background: 'red', height: '20px', width: '20px', zIndex: '5'}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '0', left: '0', fontSize: '20px'}}>sync_problem</i>
        </div> : false}
        {this.props.data.id !== 'empty-slot' ?
          <ConsolePopup open={this.state.openBackendConsolePopup}
                      entityId="cms_slot"
                      entityName="cms_slot"
                      itemId={this.props.data.id}
                      onClose={() => this.setState({...this.state, openBackendConsolePopup: false})} /> :
          <CreateSlotPopup open={this.state.openCreateSlotPopup}
                           position={this.props.data.slotPosition}
                           oldSlotId={this.state.oldSlotId}
                           widgetId={this.state.droppedWidgetId}
                           onClose={() => this.setState({...this.state, openCreateSlotPopup: false})}/>}
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

    this.setState({...this.state, openBackendConsolePopup: true})
  }

  handleDrop(event) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData("itemData"));
    if (data.slotId === this.props.data.id) {
      return;
    }

    let actionPromise = null;
    if (this.props.data.id === 'empty-slot') {
      this.setState({...this.state, droppedWidgetId: data.id, oldSlotId: data.slotId, openCreateSlotPopup: true});
      return;
    } else if (!data.slotId) {
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
    let borderStyle = this.props.data.id === 'empty-slot' ? '2px dashed #00B74A' : '2px dashed red';
    if (this.props.data.id === 'empty-slot') {
      borderStyle = '2px dashed #00B74A';
    } else {
      borderStyle = this.props.data.templateId === null ? '2px dashed red' : '2px dashed cyan';
    }
    return {
      position: 'absolute',
      border: borderStyle,
      top: (coordinate.top - 5) + 'px',
      left: (coordinate.left - 5) + 'px',
      width: (coordinate.width + 10) + 'px',
      height: (coordinate.height + 10) + 'px'
    }
  }
}