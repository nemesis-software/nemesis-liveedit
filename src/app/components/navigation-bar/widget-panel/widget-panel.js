import React, { Component } from 'react';
import WidgetLister from "./widget-lister";
import Switch from 'rc-switch';
import Pager from './pager';
import Select from 'react-select';
import 'rc-switch/assets/index.css';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';
import NemesisEntityField from "source/app/components/field-components/nemesis-entity-field/nemesis-entity-field";

export default class WidgetPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {widgets: [], page: {}, filterSearchCode: null};
    this.fieldsReferences = [];
  }

  componentWillMount() {
    this.getData(0, null);
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    let siteThemeCode = document.getElementById('liveedit_data').getAttribute('data-site-theme-code');
    let siteThemeId = document.getElementById('liveedit_data').getAttribute('data-site-theme-id');
    let pageCode = document.getElementById('liveedit_data').getAttribute('page-code');
    return (
      <div style={this.getContainerStyle()}>
        <div>
          <div className="switch-container">
            <label htmlFor="live-edit-switch">Live edit</label>
            <Switch id="live-edit-switch" onChange={this.props.onToggleLiveEdit}/>
            <label style={{marginLeft: '10px'}} htmlFor="show-all-switch">Show all</label>
            <Switch id="show-all-switch" onChange={this.props.onToggleShowAll}/>
          </div>
          <hr/>
          <div style={{padding: '0 5px'}}>
              <NemesisEntityField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} entityId={"site_theme"} label={"Theme"}
              value={{id:siteThemeId,code:siteThemeCode}} onValueChange={(item) => this.onSiteThemeChange(item && item.code)}
              name={'site_theme'} linkLabel={true}/>
          </div>
          <hr/>
          <div style={{padding: '0 5px'}}>
              <NemesisEntityField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} entityId={"cms_page"} label={"Page"}
              value={{code:pageCode}}
              name={'cms_page'} linkLabel={false}/>
          </div>
          <hr/>
          <label>Widgets</label>
          <Pager page={this.state.page} onPagerChange={this.onPagerChange.bind(this)}/>
          <div style={{padding: '0 10px'}}>
            <input className="nemesis-cms-input" type="text" placeholder="Widget code" onChange={this.handleFilterInputChange.bind(this)}/>
          </div>
        </div>
        <WidgetLister setDragState={this.props.setDragState} widgets={this.state.widgets}/>
      </div>
    )
  }

  getContainerStyle() {
    if (this.props.isHidden) {
      return {display: 'none'};
    }

    return {};
  }

  getData(page, code) {
    let url = 'widget';
    let catalogVersionIds = document.getElementById('liveedit_data').getAttribute('data-catalog-version-ids').split(',').map(item => {
      return `catalogVersion/id eq ${item}`
    });
    let filter = `(${catalogVersionIds.join(' or ')})`;
    if (code) {
      filter += ` and indexof(code, '${code}') ge 0`
    }
    let requestData = {page: page, size: 5, projection: 'search', $filter: filter};

    ApiCall.get(url, requestData).then(result => {
      this.setState({widgets: this.mapCollectionData(result.data), page: result.data.page})
    })
  }

  onSiteThemeChange(value) {
      window.location.search = `?site_theme=${value}`;
  }

  setLoadingScreen(value = true) {
      this.setState({isLoading: value})
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  onPagerChange(page) {
    this.getData(page, this.state.filterSearchCode);
  }

  handleFilterInputChange(e) {
    let value = e.target.value;
    this.setState({...this.state, filterSearchCode: value});
    this.getData(0, value);
  }
}
