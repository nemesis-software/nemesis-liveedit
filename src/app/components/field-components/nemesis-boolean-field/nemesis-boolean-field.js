import React  from 'react';
import NemesisBaseField from '../nemesis-base-field';

const styles = {
  container: {
    display: 'inline-block',
    width: 'auto',
    marginRight: '10px'
  },
  label: {
    color: '#9e9e9e',
    fontSize: '16px',
    lineHeight: '24px',
    verticalAlign: 'top'
  }
};

export default class NemesisBooleanField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><label>{this.props.label}</label></div>
          <div style={{padding: '0 5px 15px', ...this.props.style}}>
            <label className="radio-inline" style={{marginRight: '30px', paddingLeft: '25px'}}>
              <input className={"nemesis-radio-button" + ('true' === this.state.value ? ' active' : '')} type="radio" value="true" defaultChecked={'true' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label}/>
              True
            </label>
            <label className="radio-inline" style={{marginRight: '30px', paddingLeft: '25px'}}>
              <input className={"nemesis-radio-button" + ('false' === this.state.value ? ' active' : '')} type="radio" value="false" defaultChecked={'false' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label}/>
              False
            </label>
          </div>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  handleRadioChange(e) {
    this.onValueChange(e, e.target.value);
  }

  setFormattedValue(value) {
    if (value === undefined) {
      return;
    }

    return value + '';
  }

  getFormattedValue(value) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return null;
  }
}