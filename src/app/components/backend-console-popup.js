import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';


export default class BackendConsolePopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal bsSize="lg" show={this.props.open}>
        <Modal.Body>
          <iframe style={{width: '100%', height: '600px'}} src={this.buildIFrameUrl()}></iframe>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.onClose}>Close</button>
          <button onClick={this.props.onClose}>Reload changes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  buildIFrameUrl() {
    let baseUrl = 'https://localhost:8443/backend/';
    return `${baseUrl}#type=SINGLE_ITEM&itemId=${this.props.itemId}&entityId=${this.props.entityId}&entityName=${this.props.entityName}&iframePreview=true`;
  }
}