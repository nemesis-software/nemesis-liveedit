import React from 'react';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';

export default class NemesisSimpleCollectionField extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><label>{this.props.label}</label></div>
          <input type="text"
                 style={{...this.props.style}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 disabled={this.props.readOnly}
                 onKeyPress={this.onInputKeyPress.bind(this)} />
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  onInputKeyPress(e) {
    if (e.key === 'Enter') {
      let valueActual = this.state.value || [];
      valueActual.push(e.target.value);
      e.target.value = null;
      this.setState({...this.state, isDirty: true, value: valueActual});
    }
  }
}