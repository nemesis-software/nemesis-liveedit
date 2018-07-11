import React, {Component} from 'react';
import NemesisNumberField from "source/app/components/field-components/nemesis-number-field/nemesis-number-field";
import NemesisEnumField from "source/app/components/field-components/nemesis-enum-field/nemesis-enum-field";
import ApiCall from "source/app/services/api-call";
import NemesisTextField from "source/app/components/field-components/nemesis-text-field/nemesis-text-field";
import NemesisBooleanField from "source/app/components/field-components/nemesis-boolean-field/nemesis-boolean-field";
import NemesisEntityField from "source/app/components/field-components/nemesis-entity-field/nemesis-entity-field";

export default class PropertyQueryConfigEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {createForSpecifiedSearch: false};
    this.fieldsReferences = [];
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }


  render() {
    const data = this.props.data.data;
    return (
      <div className="index-query-config-editor">
        <div>{this.props.data.name}</div>
        <div>{this.props.selectedSearch !== data.code ? `Fallback from ${data.code}` : false}</div>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Boost"} name={'boost'} value={data.boost}/>
        <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Fuzziness"} name={'fuzziness'} value={data.fuzziness}/>
        <NemesisEnumField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Sort Direction"} name={'sortDirection'} values={['ASC', 'DESC']} value={['ASC', 'DESC'].indexOf(data.sortDirection)}/>
        <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Sortable"} name={'sortable'} value={data.sortable} />
        <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Highlight"} name={'highlight'} value={data.highlight} />
        <NemesisEntityField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} entityId={"search_facet"} label={"Facet"} name={'searchFacet'} value={data.searchFacet} />
        {this.props.selectedSearch !== data.code ? <div>
          <label className="checkbox-inline">
            <input type="checkbox" className={"nemesis-checkbox" + (this.state.createForSpecifiedSearch ? ' active' : '')}
                   onChange={() => this.setState({createForSpecifiedSearch: !this.state.createForSpecifiedSearch})}/>
            Create for selected search
          </label>
        </div> : false}
        <button onClick={this.onSaveButtonClick.bind(this)}>Save</button>
      </div>
    );
  }

  onSaveButtonClick() {
    if (!this.isFieldsValid()) {
      return;
    }

    let dirtyEntityProps = this.getDirtyValues();
    if (dirtyEntityProps.length === 0 && !this.state.createForSpecifiedSearch) {
      return;
    }

    console.log(this.props.data);
    const data = this.props.data.data;
    let resultObject = !this.state.createForSpecifiedSearch && data.id  ? {} : {
      ...data,
      code: this.props.selectedSearch,
      indexedProperty: data.indexedProperty ? data.indexedProperty.id : null,
      searchFacet: data.searchFacet ? data.searchFacet.id : null,
    };
    dirtyEntityProps.forEach(prop => {
      resultObject[prop.name] = prop.value;
    });
    let restMethod = !this.state.createForSpecifiedSearch && data.id ? 'patch' : 'post';
    let restUrl = !this.state.createForSpecifiedSearch && data.id ? `indexed_property_query_config/${data.id}` : 'indexed_property_query_config';

    let url = `https://localhost:8112/storefront/rest/${restUrl}`;
    ApiCall[restMethod](url, resultObject).then(result => {
      console.log('saved');
    })
  }

  resetDirtyStates() {
    this.fieldsReferences.forEach(field => {
      field.resetDirtyState();
    });
  }

  isFieldsValid() {
    let isNotValid = false;
    this.fieldsReferences.forEach(field => {
      let isFieldValid = field.isFieldValid();
      isNotValid = isNotValid || !isFieldValid;
    });
    return !isNotValid;
  }

  getDirtyValues() {
    let result = [];
    this.fieldsReferences.forEach(field => {
      let dirtyValue = field.getChangeValue();
      if (dirtyValue) {
        result.push(dirtyValue);
      }
    });
    return result;
  }
}