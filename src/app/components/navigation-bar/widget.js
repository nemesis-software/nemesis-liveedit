import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';


export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">
        <div>{this.props.widget.code}</div>
        <div>{this.props.widget.name}</div>
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        <div className="widget-element" draggable={true} onDragStart={this.handleDragStart.bind(this)}>
            <i className="material-icons widget-icon">widgets</i> {this.props.widget.code}
        </div>
      </OverlayTrigger>

    );
  }

  handleDragStart(event) {
    event.dataTransfer.setData("itemData", JSON.stringify({id: this.props.widget.id, slotId: null}));
  }
}