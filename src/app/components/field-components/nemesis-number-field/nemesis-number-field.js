import React from 'react';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisNumberField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><label>{this.props.label}</label></div>
          <input type="number" step={this.props.step || '1'}
                 style={{...this.props.style}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.getInputValue(this.state.value)}
                 disabled={this.props.readOnly} onChange={(e) => this.onValueChange(e, e.target.value)}/>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  getInputValue(value) {
    if (value === 0) {
      return 0;
    }

    return value || '';
  }

  isEmptyValue() {
    if (this.state.value === null) {
      return true;
    }

    if (isFinite(this.state.value)) {
      return false;
    }

    return true;
  }
}