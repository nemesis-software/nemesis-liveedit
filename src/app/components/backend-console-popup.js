import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class BackendConsolePopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal bsSize="lg" show={this.props.open} onHide={this.props.onClose} backdrop="static">
        <Modal.Body>
          <iframe style={{width: '100%', height: '600px'}} src={this.buildIFrameUrl()}></iframe>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" onClick={this.props.onClose}>Close</button>
          <button className="nemesis-button success-button" style={{marginLeft: '5px'}} onClick={() => window.location.reload()}>Reload changes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  buildIFrameUrl() {
    let dataElement = $('#liveedit_data')[0];
    let baseUrl = dataElement.getAttribute('data-backend-url');
    return `${baseUrl}#type=SINGLE_ITEM&itemId=${this.props.itemId}&entityId=${this.props.entityId}&entityName=${this.props.entityName}&iframePreview=true`;
  }
}