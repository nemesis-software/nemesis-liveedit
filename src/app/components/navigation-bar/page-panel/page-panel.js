import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default class PagePanel extends Component {
  constructor(props) {
    super(props);
    let preference = document.getElementById('liveedit_data').getAttribute('data-ui-experience');
    this.state = {user: null, isInLoggingState: false, preference: preference, isLoading: false};
  }

  componentWillMount() {
    axios({
      url: `${this.getBaseUrl()}/live-edit/user?site=${this.getSiteCode()}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      this.setState({user: result.data});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHidden) {
      this.setState({isInLoggingState: false});
    }
  }

  render() {
    return (
      <div style={this.getContainerStyle()}>
        {this.state.isLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <div className="user-container">
            Select Email Page:
        </div>
        <hr/>
        <div style={{padding: '0 5px'}}>
          <Select cache={false}
                  clearable={false}
                  value={this.state.preference ? {value: this.state.preference, label: this.state.preference} : this.state.preference}
                  onChange={(item) => this.onSitePreferencesChange(item && item.value)}
                  options={[{value: 'normal', label: 'NORMAL'}, {value: 'mobile', label: 'MOBILE'}, {value: 'tablet', label: 'TABLET'}]}/>
        </div>
        <hr/>
        <div className="user-container">
            Select Invoice Page:
        </div>
        <hr/>
        <div style={{padding: '0 5px'}}>
          <Select cache={false}
                  clearable={false}
                  value={this.state.preference ? {value: this.state.preference, label: this.state.preference} : this.state.preference}
                  onChange={(item) => this.onSitePreferencesChange(item && item.value)}
                  options={[{value: 'normal', label: 'NORMAL'}, {value: 'mobile', label: 'MOBILE'}, {value: 'tablet', label: 'TABLET'}]}/>
        </div>
      </div>
    );
  }

  setLoadingScreen(value = true) {
    this.setState({isLoading: value})
  }

  onLoginClick() {
    this.setState({isInLoggingState: true});
  }

  onSitePreferencesChange(value) {
    this.setLoadingScreen();
    window.location.search = `?site_preference=${value}`;
  }

  onLogoutClick() {
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', `${this.getBaseUrl()}/logout/impersonate?site=${this.getSiteCode()}`);

    let hiddenField = document.createElement("input");
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'username');
    hiddenField.setAttribute('value', 'anonymous');
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
  }

  getContainerStyle() {
    if (this.props.isHidden) {
      return {display: 'none'};
    }

    return {};
  }

  getBaseUrl() {
    return document.getElementById('liveedit_data').getAttribute('data-rest-base-url');
  }

  getSiteCode() {
    return document.getElementById('liveedit_data').getAttribute('data-site-code');
  }
}
