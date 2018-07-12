import React, {Component} from 'react';
import ApiCall from "source/app/services/api-call";
import Select from 'react-select';
import SelectCustomArrow from "source/app/components/helper-components/select-custom-arrow";
import IndexQueryConfigEditor from "source/app/components/index-query-config/index-query-config-editor";
import PropertyQueryConfig from "source/app/components/index-query-config/property-query-config";

const INDEX_QUERY_CONFIG = 'indexQueryConfig';
const PROPERTY_QUERY_CONFIG = 'propertyQueryConfig';

export default class IndexQueryConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {searchOptions: [], selectedSearch: null, indexedType: null, queryConfigType: INDEX_QUERY_CONFIG};

  }

  componentWillMount() {
    let metaDataContainer = document.getElementById('search-live-edit-meta');
    let indexConfig = metaDataContainer.getAttribute('data-indexconfig');
    let indexType = metaDataContainer.getAttribute('data-indexedtype');
    let baseUrl = document.getElementById('liveedit_data').getAttribute('data-rest-base-url');
    Promise.all([ApiCall.get(`${baseUrl}/facade/search/indexQueryConfigs/${indexConfig}/${indexType}`), ApiCall.get(`${baseUrl}/facade/search/indexedProperties/${indexConfig}/${indexType}`)])
    .then(result => {
      this.setState({searchOptions: result[0].data, indexedProperties: result[1].data, indexedType: indexType})
    });
  }

  render() {
    return (
      <div className="index-query-config" style={this.getContainerStyle()}>
        {this.state.selectedSearch ?
          <div>
            <div className="select-search-code">{this.state.selectedSearch.code}</div>
            <div style={{padding: '5px'}}>
              <Select style={{width: '100%'}}
                      clearable={false}
                      arrowRenderer={() => <SelectCustomArrow/>}
                      value={this.getSelectedItem(this.state.queryConfigType)}
                      onChange={(item) => this.setState({queryConfigType: item.value})}
                      options={[{value: INDEX_QUERY_CONFIG, label: 'Index query config'}, {value: PROPERTY_QUERY_CONFIG, label: 'Property query config'}]}/>
            </div>
            {this.state.queryConfigType === INDEX_QUERY_CONFIG ?
              <IndexQueryConfigEditor data={this.state.selectedSearch}/>
              :
              <PropertyQueryConfig selectedSearch={this.state.selectedSearch.code} indexedProperties={this.state.indexedProperties} data={this.state.properties} />
            }
          </div> :
          <Select style={{width: '100%'}}
                  clearable={false}
                  className={this.props.selectClassName}
                  arrowRenderer={() => <SelectCustomArrow/>}
                  onChange={(item) => this.onSearchSelect(item.value)}
                  options={this.state.searchOptions.map(this.getOptionFields.bind(this))}/>
        }
      </div>
    );
  }

  onSearchSelect(search) {
    let baseUrl = document.getElementById('liveedit_data').getAttribute('data-rest-base-url');
    let url = `${baseUrl}/facade/search/propertyQueryConfigs/relevant/${this.state.indexedType}/${search.code}`
    ApiCall.get(url).then(result => {
      let data = result.data;
      let properties = Object.keys(data).map(key => {
        return {name: key, data: data[key]};
      })
      this.setState({selectedSearch: search, properties: properties});
    })

  }


  getOptionFields(searchOption) {
    return {value: searchOption, label: searchOption.code};
  }

  getContainerStyle() {
    if (this.props.isHidden) {
      return {display: 'none'};
    }

    return {};
  }

  getSelectedItem(item) {
    if (item === INDEX_QUERY_CONFIG) {
      return {value: INDEX_QUERY_CONFIG, label: 'Index query config'}
    }

    return {value: PROPERTY_QUERY_CONFIG, label: 'Property query config'}
  }
}