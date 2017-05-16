import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import SlotService from '../services/slot-service'

export default class BackendConsolePopup extends Component {
  constructor(props) {
    super(props);
    this.viewInfo = this.getViewInfo();
    this.state = {slotCode: '', isCreatedForPage: true}
  }

  render() {

    return (
      <Modal show={this.props.open}>
        <Modal.Body>
          <div>
            <input className="nemesis-cms-input" value={this.state.slotCode} onChange={e => this.setState({...this.state, slotCode: e.target.value})} type="text" placeholder="Slot code"/>
          </div>
          <div style={{padding: '10px 0'}}>
            <div style={{fontSize: '16px'}}>Create slot for:</div>
            <div style={{paddingLeft: '5px'}}>
              <label className="create-for-label">
                <input className="nemesis-radio-button" type="radio" value={true} defaultChecked={true}  name={'create-for'}
                       onChange={() => this.setState({...this.state, isCreatedForPage: true})}/>
                <span style={{fontSize: '14px'}}>Page - {this.viewInfo.pageCode}</span>
              </label>
              <label className="create-for-label">
                <input className="nemesis-radio-button" type="radio" value={false} name={'create-for'}
                       onChange={() => this.setState({...this.state, isCreatedForPage: false})}/>
                <span style={{fontSize: '14px'}}>Template - {this.viewInfo.templateCode}</span>
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-cms-button" onClick={this.props.onClose}>Cancel</button>
          <button className="nemesis-cms-button" onClick={this.onCreateButtonClick.bind(this)}>Create</button>
        </Modal.Footer>
      </Modal>
    );
  }

  getViewInfo() {
    let dataElement = $('#liveedit_data')[0];
    return {
      pageCode: dataElement.getAttribute('page-code'),
      pageId: dataElement.getAttribute('page-id'),
      templateCode: dataElement.getAttribute('template-code'),
      templateId: dataElement.getAttribute('template-id')
    }
  }

  onCreateButtonClick() {
    let pageId = this.state.isCreatedForPage ? this.viewInfo.pageId : null;
    let tempalteId = this.state.isCreatedForPage ? null :this.viewInfo.templateId;
    SlotService.initializeSlot(this.state.slotCode, this.props.position, this.props.widgetId, pageId, tempalteId).then(() => {
      if (this.props.oldSlotId) {
        SlotService.removeWidgetFromSlot(this.props.oldSlotId, this.props.widgetId).then(() => {
          window.location.reload();
        })
      } else {
        window.location.reload();
      }
    });
  }
}