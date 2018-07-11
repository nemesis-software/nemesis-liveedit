import React, { Component } from 'react';
import ConsolePopup from '../backend-console-popup';


export default class NavigationBottomBar extends Component {
  constructor(props) {
    super(props);
    this.pageCode = document.getElementById('liveedit_data').getAttribute('page-code');
    this.templateCode = document.getElementById('liveedit_data').getAttribute('template-code');
    this.pageId = document.getElementById('liveedit_data').getAttribute('page-id');
    this.templateId = document.getElementById('liveedit_data').getAttribute('template-id');
    this.state = {selectedType: null, selectedId: null, openBackendConsolePopup: false}
  }

  render() {
    return (
      <div className="navigation-bottom-bar" style={this.getContainerStyle()}>
        <div className="navigation-bottom-bar-item"><span title={this.pageCode} onClick={() => this.openConsolePopup('cms_page', this.pageId)}>Page</span></div>
        <div className="navigation-bottom-bar-item"><span title={this.templateCode} onClick={() => this.openConsolePopup('cms_template', this.templateId)}>Template</span></div>
        {this.state.openBackendConsolePopup ? <ConsolePopup open={this.state.openBackendConsolePopup}
                      entityId={this.state.selectedType}
                      entityName={this.state.selectedType}
                      itemId={this.state.selectedId}
                      onClose={() => this.setState({openBackendConsolePopup: false})} /> : false}
      </div>
    );
  }

  openConsolePopup(selectedType, selectedId) {
    this.setState({selectedType: selectedType, selectedId: selectedId, openBackendConsolePopup: true})
  }

  getContainerStyle() {
    if (this.props.isHidden) {
      return {display: 'none'};
    }

    return {};
  }
}