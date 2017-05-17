import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import ConsolePopup from '../backend-console-popup';

export default class Widget extends Component {
  constructor(props) {
    super(props);

    this.state = {openBackendConsolePopup: false};
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">
        <div style={{wordBreak: 'break-all'}}>{this.props.widget.code}</div>
        <div style={{wordBreak: 'break-all'}}>{this.props.widget.name}</div>
        <div style={{wordBreak: 'break-all'}}>{this.props.widget.catalogVersion}</div>
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="right" overlay={tooltip}>
        <div className="widget-element" draggable={true} onDragStart={this.handleDragStart.bind(this)}>
          <div onClick={this.handleClickWidgetMenu.bind(this)} style={{position: 'absolute', top: '0', right: '0', background: '#569dbf', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}}>
            <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px'}}>more_horiz</i>
          </div>
          <ConsolePopup open={this.state.openBackendConsolePopup}
                        entityId="widget"
                        entityName={this.props.widget.entityName}
                        itemId={this.props.widget.id}
                        onClose={() => this.setState({...this.state, openBackendConsolePopup: false})} />
          <i className="material-icons widget-icon">widgets</i> {this.props.widget.code}
        </div>
      </OverlayTrigger>

    );
  }

  handleClickWidgetMenu() {
    if (this.state.openBackendConsolePopup) {
      return;
    }

    this.setState({openBackendConsolePopup: true})
  }

  handleDragStart(event) {
    event.dataTransfer.setData("itemData", JSON.stringify({id: this.props.widget.id, slotId: null}));
  }
}