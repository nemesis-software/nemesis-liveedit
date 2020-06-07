import React, { Component } from 'react';
import ConsolePopup from '../../backend-console-popup';


export default class CreateNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {openBackendConsolePopup: false};
  }

  render() {
    return (
      <div style={{padding: '0 13px'}}>
        <div style={{width: '100%', textAlign: 'center', height: '36px'}} className="nemesis-button success-button" onClick={() => this.setState({openBackendConsolePopup: true})}>Create new page</div>
        {this.state.openBackendConsolePopup ? <ConsolePopup open={this.state.openBackendConsolePopup}
                                                            newPageData={true}
                                                            onClose={() => this.setState({openBackendConsolePopup: false})} />: false}
      </div>
    );
  }
}
