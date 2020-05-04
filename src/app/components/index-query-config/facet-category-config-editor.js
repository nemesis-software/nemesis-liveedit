import React, {Component} from 'react';
import NemesisNumberField from "source/app/components/field-components/nemesis-number-field/nemesis-number-field";
import NemesisEnumField from "source/app/components/field-components/nemesis-enum-field/nemesis-enum-field";
import ApiCall from "source/app/services/api-call";
import NemesisTextField from "source/app/components/field-components/nemesis-text-field/nemesis-text-field";
import NemesisBooleanField from "source/app/components/field-components/nemesis-boolean-field/nemesis-boolean-field";
import NemesisEntityField from "source/app/components/field-components/nemesis-entity-field/nemesis-entity-field";

export default class FacetCategoryConfigEditor extends Component {
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
    const data = this.props.data;
    return (
      <div className="facet-category-config-editor">
          <div className="field-name">{this.props.data.code} <span onClick={() => this.props.goBack()} className="close-button">x</span></div>
          <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Weight"} name={'weight'} value={data.weight} />
          <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Max Shown Facet Values"} name={'maxShownFacetValues'} value={data.maxShownFacetValues} />
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Visible"} name={'visible'} value={data.visible} />
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Color"} name={'color'} value={data.color} />
          <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} label={"Values Sorter"} name={'facetValuesSorter'} value={data.facetValuesSorter}/>
          <NemesisEntityField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} entityId={"category"} label={"Category"}
          name={"category"} value={{code: data.categoryCode}}/>
          <NemesisEntityField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} entityId={"search_facet_profile"} label={"Facet Profile"}  name={'facetProfile'} value={data.facetProfile} linkLabel={true}/>
          <div style={{textAlign: 'center', marginTop: '10px'}}><button style={{width: '80%', padding: '7px 25px', height: '34px'}} className="nemesis-button success-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button></div>
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

    const data = this.props.data;
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
    let restUrl = !this.state.createForSpecifiedSearch && data.id ? `search_facet_category_config/${data.id}` : 'search_facet_category_config';

    ApiCall[restMethod](restUrl, resultObject).then(result => {
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
