import React, { Component } from 'react';
import UserDetailsRenderer from './user-details-renderer';
import LogNewUser from './log-new-user';
import Select from 'react-select';
import PersonalizationFilter from './personalization-filters/personalization-filters'
import axios from 'axios';

export default class PersonalizationPanel extends Component {
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
        {!this.state.isInLoggingState ?
          <div><UserDetailsRenderer user={this.state.user}/>
            <div style={{padding: '0 10px'}}>
              {this.state.user && this.state.user.username === 'anonymous' ?
                <div className="nemesis-button" onClick={this.onLoginClick.bind(this)}>login</div> :
                <div className="nemesis-button" onClick={this.onLogoutClick.bind(this)}>logout</div>
              }
            </div>
          </div>
          : <LogNewUser setLoadingScreen={this.setLoadingScreen.bind(this)}/>
        }
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
        <PersonalizationFilter setLoadingScreen={this.setLoadingScreen.bind(this)}/>
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