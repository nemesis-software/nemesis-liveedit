import React, { Component } from 'react';
import ConsolePopup from '../../backend-console-popup';
import ApiCall from "source/app/services/api-call";

export default class SynchronizeCatalogs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{padding: '0 13px'}}>
        <div style={{width: '100%', textAlign: 'center', height: '36px'}}
            className="nemesis-button danger-button" onClick={() => this.synchronize()}>
            Synchronize
        </div>
      </div>
    );
  }

  synchronize() {
      //this.props.setLoadingScreen();
      ApiCall.post(`${this.getBaseUrl()}/site/${this.getSiteCode()}/synchronize/cms`).then(result => {
        this.setState({filters: result.data.content, page: this.getPageData(result.data)}, () => {
          this.props.setLoadingScreen(false);
        })
      })
  }

  getSiteCode() {
    return document.getElementById('liveedit_data').getAttribute('data-site-code');
  }

  getBaseUrl() {
    return document.getElementById('liveedit_data').getAttribute('data-rest-url');
  }
}
