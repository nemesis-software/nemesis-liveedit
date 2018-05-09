import React, { Component } from 'react';
import WidgetLister from "./widget-lister";
import Switch from 'rc-switch';
import Pager from './pager';
import 'rc-switch/assets/index.css';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';

export default class WidgetPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {widgets: [], page: {}, filterSearchCode: null};

  }

  componentWillMount() {
    this.getData(0, null);
  }

  render() {
    return (
      <div style={this.getContainerStyle()}>
        <div>
          <div className="switch-container">
            <label htmlFor="live-edit-switch">Live edit</label>
            <Switch id="live-edit-switch" onChange={this.props.onToggleLiveEdit}/>
            <label style={{marginLeft: '10px'}} htmlFor="show-all-switch">Show all</label>
            <Switch id="show-all-switch" onChange={this.props.onToggleShowAll}/>
          </div>
          <Pager page={this.state.page} onPagerChange={this.onPagerChange.bind(this)}/>
          <div style={{padding: '0 10px'}}>
            <input className="nemesis-cms-input" type="text" placeholder="Widget code" onChange={this.handleFilterInputChange.bind(this)}/>
          </div>
        </div>
        <WidgetLister widgets={this.state.widgets}/>
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
    let url = 'widget/search/findByCatalogVersionCode';
    let dataElement = $('#liveedit_data')[0];
    let catalogVersion = dataElement.getAttribute('data-catalog-version');
    let catalogVersionActual = catalogVersion || 'Staged';
    let requestData = {page: page, size: 10, catalogVersionCode: catalogVersionActual, projection: 'search'};
    if (code) {
      url = 'widget/search/findByCodeLikeAndCatalogVersionCode';
      requestData.code = '%' + code + '%';
    }
    ApiCall.get(url, requestData).then(result => {
      this.setState({widgets: this.mapCollectionData(result.data), page: result.data.page})
    })
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