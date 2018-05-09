import React, { Component } from 'react';

import ConsolePopup from '../../backend-console-popup';

export default class UserDetailsRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false};
  }

  render() {
    if (!this.props.user) {
      return false;
    }

    return (
      <div className="user-details-renderer">
        <img className="user-image" alt="No img" src={this.props.user.avatar.url} />
        <div className="user-names">
          <div className="user-display-name" onClick={() => this.setState({openBackendConsolePopup: true})}>{this.props.user.displayName}</div>
        </div>
        {this.state.openBackendConsolePopup ? <ConsolePopup open={this.state.openBackendConsolePopup}
                      entityId="customer"
                      entityName="customer"
                      itemId={this.props.user.id}
                      onClose={() => this.setState({...this.state, openBackendConsolePopup: false})} /> : false}
      </div>
    )

  }
}