import React, {Component} from 'react';
import _ from 'lodash';
import ApiCall from '../../../services/api-call';
import Select from 'react-select';

export default class LogNewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {value: null};
  }

  render() {
    return (
      <div className="log-new-user">
        <Select.Async cache={false}
                      value={this.state.value ? {value: this.state.value, label: this.state.value.code} : this.state.value}
                      onChange={(item) => this.onValueChange(item && item.value)}
                      loadOptions={this.getUsers.bind(this)}/>
        <button className="nemesis-button success-button" style={{width: '100%', height: 'unset', textAlign: 'center', marginTop: '5px'}} onClick={this.onLoginClick.bind(this)}>Log as user</button>
      </div>
    );
  }

  onValueChange(item) {
    this.setState({value: item});
  }

  getUsers(inputText) {
    let inputTextActual = inputText || '';
    return ApiCall.get('customer', {
      page: 0,
      size: 10,
      catalogCode: `%${inputTextActual}%`,
      code: `%${inputTextActual}%`,
      projection: 'search'
    }).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      return {options: data.map(this.mapDataSource.bind(this))};
    })
  }

  mapDataSource(item) {
    return {
      value: item,
      label: item.code
    }
  }

  onLoginClick() {
    this.props.setLoadingScreen();
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', `${this.getBaseUrl()}/login/impersonate?site=${this.getSiteCode()}`);
    let hiddenField = document.createElement("input");
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'username');
    hiddenField.setAttribute('value', this.state.value.code);

    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
  }


  getBaseUrl() {
    return document.getElementById('liveedit_data').getAttribute('data-rest-base-url');
  }

  getSiteCode() {
    return document.getElementById('liveedit_data').getAttribute('data-site-code');
  }
}