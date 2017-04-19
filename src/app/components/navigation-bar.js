import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import ApiCall from '../services/api-call';
import _ from 'lodash';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        <Toggle
          style={{width: '100px'}}
          label="Live edit"
          onToggle={this.props.onToggleLiveEdit}
        />
        <Toggle
          style={{width: '100px'}}
          label="Show All"
          onToggle={this.props.onToggleShowAll}
        />
      </div>
    );
  }

  getData() {
    // let url = 'widget/search/findByCodeLikeAndCatalogVersionCode';
    let url = 'widget/search/findByCatalogVersionCode';
    ApiCall.get(url, {page: 1, size: 10, catalogVersionCode: 'Staged'}).then(result => {
      console.log(this.mapCollectionData(result.data));
    })
  }
  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

}