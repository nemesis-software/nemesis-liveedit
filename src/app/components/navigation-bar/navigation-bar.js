import React, { Component } from 'react';
import ApiCall from '../../services/api-call';
import _ from 'lodash';
import WidgetLister from './widget-lister';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import Pager from './pager';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {widgets: [], page: {}, filterSearchCode: null}
  }

  componentWillMount() {
    this.getData(1, null);
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="live-edit-switch">Live edit</label>
          <Switch id="live-edit-switch" onChange={this.props.onToggleLiveEdit}/>
          <label htmlFor="show-all-switch">Show all</label>
          <Switch id="show-all-switch" onChange={this.props.onToggleShowAll}/>
          <Pager page={this.state.page} onPagerChange={this.onPagerChange.bind(this)}/>
          <div style={{display: 'inline-block', width: '256px'}}>
            <input type="text" placeholder="Widget code" onChange={this.handleFilterInputChange.bind(this)}/>
          </div>
        </div>
        <WidgetLister widgets={this.state.widgets}/>
      </div>
    );
  }

  getData(page, code) {
    let url = 'widget/search/findByCatalogVersionCode';
    let requestData = {page: page, size: 10, catalogVersionCode: 'Staged'};
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
    this.getData(1, value);
  }

}