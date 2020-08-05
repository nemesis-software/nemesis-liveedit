import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';

export default class BackendConsolePopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal size="large" show={this.props.open} onHide={this.props.onClose} backdrop="static">
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
    if (this.props.newWidgetData) {
      return `${baseUrl}admin#type=nemesisNewWidget&slotId=${this.props.newWidgetData.slotId}&iframePreview=true`;
    }
    if (this.props.newPageData) {
      let templateCode = dataElement.getAttribute('template-code');
      let templateId = dataElement.getAttribute('template-id');
      let catalogVersionCode = dataElement.getAttribute('data-catalog-version');
      let catalogVersionId = dataElement.getAttribute('current-catalog-version-id');
      let catalogCode = dataElement.getAttribute('current-catalog-code');
      return `${baseUrl}admin#type=nemesisNewPage&templateId=${templateId}&templateCode=${templateCode}&catalogVersionId=${catalogVersionId}&catalogCode=${catalogCode}:${catalogVersionCode}&iframePreview=true`;
    }
    return `${baseUrl}admin#type=SINGLE_ITEM&itemId=${this.props.itemId}&entityId=${this.props.entityId}&entityName=${this.props.entityName}&iframePreview=true`;
  }
}
