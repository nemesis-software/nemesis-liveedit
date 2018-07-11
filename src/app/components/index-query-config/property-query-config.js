import React, {Component} from 'react';
import PropertyQueryConfigEditor from "source/app/components/index-query-config/property-query-config-editor";
import SelectCustomArrow from "source/app/components/helper-components/select-custom-arrow";
import Select from 'react-select';

export default class PropertyQueryConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedProperty: null};
  }

  render() {
    return (
      <div className="property-query-config">
        {this.state.selectedProperty ?
          <PropertyQueryConfigEditor selectedSearch={this.props.selectedSearch} data={this.state.selectedProperty}/> :
          <div>
            <Select style={{width: '100%'}}
                    clearable={false}
                    arrowRenderer={() => <SelectCustomArrow/>}
                    onChange={(item) => this.onIndexPropertySelect(item.value)}
                    options={this.getAllowedIndexedProperties()}/>
            {this.props.data.map(prop => <div onClick={() => this.setState({selectedProperty: prop})}
                                           key={prop.name}>{prop.name}</div>)}
          </div>
        }
      </div>
    );
  }

  onIndexPropertySelect(indexedProperty) {
    this.setState({selectedProperty: {name: indexedProperty.code, data: {indexedProperty: indexedProperty, code: this.props.selectedSearch}}});
  }

  getAllowedIndexedProperties() {
    let configuratedProperties = [];
    this.props.data.forEach(item => {
      configuratedProperties.push(item.data.indexedProperty.id);
    });

    console.log(configuratedProperties);

    return this.props.indexedProperties.filter(p => configuratedProperties.indexOf(p.id) === -1).map(p => {
      return {value: p, label: p.code}
    })
  }

  getOptionFields(searchOption) {
    return {value: searchOption, label: searchOption.code};
  }

}