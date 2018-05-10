import React, {Component} from 'react';
import ApiCall from '../../../../services/api-call';
import Pager from '../../widget-panel/pager';
import FilterItem from './filter-item';

const pageSize = 7;

export default class PersonalizationFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {filters: [], page: {number: 0, totalPages: 1}};
  }

  componentWillMount() {
    this.getData(0, pageSize);
  }

  render() {
    return (
      <div className="personalization-filters">
        <Pager page={this.state.page} size={pageSize} onPagerChange={this.onPagerChange.bind(this)}/>
        <div className="filter-items-container">
          {this.state.filters.map((filter, index) => <FilterItem setLoadingScreen={this.props.setLoadingScreen} filter={filter} key={index} />)}
        </div>
      </div>
    );
  }

  getPageData(data) {
    return {
      totalPages: data.totalPages,
      number: data.number,
    }
  }

  onPagerChange(page) {
    this.getData(page, pageSize);
  }

  getData(page, size) {
    this.props.setLoadingScreen();
    ApiCall.get(`${this.getBaseUrl()}/live-edit/filters?site=${this.getSiteCode()}`, {
      page: page,
      size: size
    }).then(result => {
      this.setState({filters: result.data.content, page: this.getPageData(result.data)}, () => {
        this.props.setLoadingScreen(false);
      })
    })
  }


  getBaseUrl() {
    return document.getElementById('liveedit_data').getAttribute('data-rest-base-url');
  }

  getSiteCode() {
    return document.getElementById('liveedit_data').getAttribute('data-site-code');
  }
}