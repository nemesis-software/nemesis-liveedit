import React, { Component } from 'react';
import SlotService from '../services/slot-service';
import Modal from 'react-bootstrap/lib/Modal';
import _ from 'lodash';

export default class SlotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {openDeleteWidgetModal: false, widgets: []};
    this.allWidgetsIds = [];
  }

  render() {
    return (
      <div style={this.getStyles()} onDragOver={this.handleDragover.bind(this)} onDrop={this.handleDrop.bind(this)}>
        <div onClick={this.handleClickSlotMenu.bind(this)} style={{position: 'absolute', top: '0', left: '0', background: 'blue', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px'}}>more_horiz</i>
        </div>
        <Modal show={this.state.openDeleteWidgetModal}>
          <Modal.Header>
            <Modal.Title>Delete Widgets</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Widgets in slot</div>
            {this.state.widgets.map((item, index) =>
              <div key={index}>
                <label>
                  <input type="checkbox" className="nemesis-checkbox" defaultChecked={true} onChange={(ev) => this.handleCheckBoxClick(item.id, ev.target.checked)} />
                  <span style={{fontSize: '16px', marginLeft: '5px'}}>{item.code}</span>
                </label>
              </div> )}
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => this.setState({...this.state, openDeleteWidgetModal: false})}>Cancel</button>
            <button onClick={this.handleDoneDeleteWidget.bind(this)}>Done</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleDragover(event) {
    event.preventDefault();
  }

  handleCheckBoxClick(id, isChecked) {
    if (isChecked) {
      this.allWidgetsIds.push(id);
    } else {
      let indexOfWidget = this.allWidgetsIds.indexOf(id);
      if (indexOfWidget > -1) {
        this.allWidgetsIds.splice(indexOfWidget, 1);
      }
    }
  }

  handleClickSlotMenu() {
    if (this.state.openDeleteWidgetModal) {
      return;
    }

    SlotService.getSlotWidgets(this.props.data.id).then(widgets => {
      this.allWidgetsIds = widgets.map(item => item.id);
      this.setState({openDeleteWidgetModal: true, widgets: widgets})
    })
  }

  handleDoneDeleteWidget() {
    SlotService.updateSlotWidgets(this.props.data.id, this.allWidgetsIds).then(result => {
      window.location.reload();
    }, err => console.log(err));
    this.setState({...this.state, openDeleteWidgetModal: false});
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

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }
}