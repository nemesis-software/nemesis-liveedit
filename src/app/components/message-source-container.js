import React, { Component } from 'react';
import ConsolePopup from './backend-console-popup';

export default class MessageSourceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false};
  }

  render() {
    return (
      <div style={this.getStyles()}>
        <div onClick={this.handleClickSlotMenu.bind(this)} style={{position: 'absolute', top: '0', left: '0', background: 'green', height: '10px', width: '30px', zIndex: '5', cursor: 'pointer'}}>
          <i className="material-icons" style={{color: 'white', position: 'absolute', top: '-8px', left: '2px'}}>more_horiz</i>
        </div>
        {this.state.openBackendConsolePopup ? <ConsolePopup open={this.state.openBackendConsolePopup}
                      entityId="message_source_property"
                      entityName="message_source_property"
                      itemId={this.props.data.id}
                      onClose={() => this.setState({...this.state, openBackendConsolePopup: false})} /> : false}
      </div>
    );
  }


  handleClickSlotMenu() {
    if (this.state.openBackendConsolePopup) {
      return;
    }

    this.setState({...this.state, openBackendConsolePopup: true})
  }


  getStyles() {
    let coordinate = this.props.data.coordinate;
    return {
      position: 'absolute',
      border: '2px dashed green',
      top: (coordinate.top - 5) + 'px',
      left: (coordinate.left - 5) + 'px',
      width: (coordinate.width + 10) + 'px',
      height: (coordinate.height + 10) + 'px'
    }
  }
}