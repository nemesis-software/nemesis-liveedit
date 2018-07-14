import React, { Component } from 'react';

export default class AddNewWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="widget-element" draggable={true} onDragStart={this.handleDragStart.bind(this)}>
        <i className="material-icons widget-icon">add</i> Add new widget
      </div>
    );
  }

  handleDragStart(event) {
    event.dataTransfer.setData("itemData", JSON.stringify({id: 'NEMESIS_NEW_WIDGET', slotId: null}));
  }
}