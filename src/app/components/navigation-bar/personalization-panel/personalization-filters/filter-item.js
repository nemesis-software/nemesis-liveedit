import React, { Component } from 'react';
import Switch from 'rc-switch';
import ApiCall from "source/app/services/api-call";


export default class FilterItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="filter-item">
        <label title={Object.keys(this.props.filter)[0]} className="filter-item-name" htmlFor={Object.keys(this.props.filter)[0]}>{Object.keys(this.props.filter)[0]}</label>
        <Switch defaultChecked={Object.values(this.props.filter)[0]} id={Object.keys(this.props.filter)[0]} onChange={() => this.onSwitchToggle()}/>
      </div>
    );
  }

  onSwitchToggle() {
    this.props.setLoadingScreen();
    ApiCall.put(`https://localhost:8112/storefront/live-edit/filter/${Object.keys(this.props.filter)[0]}`).then(() => {
      window.location.reload();
    })
  }
}