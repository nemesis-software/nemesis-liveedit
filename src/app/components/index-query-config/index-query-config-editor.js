import React, {Component} from 'react';
import NemesisNumberField from "source/app/components/field-components/nemesis-number-field/nemesis-number-field";
import NemesisEnumField from "source/app/components/field-components/nemesis-enum-field/nemesis-enum-field";
import NemesisSimpleCollectionField from "source/app/components/field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field";
import ApiCall from "source/app/services/api-call";

export default class IndexQueryConfigEditor extends Component {
  constructor(props) {
    super(props);
    this.fieldsReferences = [];
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }


  render() {
    const data = this.props.data;
    return (
      <div className="index-query-config-editor">
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Fuzzy Max Expansions"} name={'fuzzyMaxExpansions'} value={data.fuzzyMaxExpansions}/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Highlight Fragment Size"} name={'highlightFragmentSize'} value={data.highlightFragmentSize}/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Highlight Num Of Fragments"} name={'highlightNumOfFragments'} value={data.highlightNumOfFragments}/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Max Page Size"} name={'maxPageSize'} value={data.maxPageSize}/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Page Size"} name={'pageSize'} value={data.pageSize}/>
        <NemesisEnumField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Default Sort Direction"} name={'defaultSortDirection'} values={['ASC', 'DESC']} value={['ASC', 'DESC'].indexOf(data.defaultSortDirection)}/>
        <NemesisEnumField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Multi Term Operator"} name={'multiTermOperator'} values={['AND', 'OR']} value={['AND', 'OR'].indexOf(data.multiTermOperator)}/>
        <NemesisSimpleCollectionField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Default Sorts"} name={'defaultSorts'} value={data.defaultSorts}/>
        <div style={{textAlign: 'center', marginTop: '10px'}}><button style={{width: '80%', padding: '7px 25px', height: '34px'}} className="nemesis-button success-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button></div>
      </div>
    );
  }

  onSaveButtonClick() {
    if (!this.isFieldsValid()) {
      return;
    }

    let dirtyEntityProps = this.getDirtyValues();
    if (dirtyEntityProps.length === 0) {
      return;
    }

    let resultObject = {};
    dirtyEntityProps.forEach(prop => {
      resultObject[prop.name] = prop.value;
    });

    let url = `search_index_query_config/${this.props.data.id}`;
    ApiCall.patch(url, resultObject).then(result => {
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