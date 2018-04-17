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
    this.state = {widgets: [], page: {}, filterSearchCode: null, topBarX: 20, topBarY: 100};
    this.mouseY = 0;
    this.mouseX = 0;
    this.isHoldOnTopBar = false;
  }

  componentWillMount() {
    this.getData(0, null);
    let that = this;
    document.onmousemove = (e) => {
      if (that.isHoldOnTopBar) {
        let actualX = that.getValidActualX(that.state.topBarX + (e.pageX - that.mouseX));
        let actualY = that.getValidActualY(that.state.topBarY + (e.pageY - that.mouseY));
        that.setState({...that.state, topBarX: actualX, topBarY: actualY});
      }
      that.mouseX = e.pageX;
      that.mouseY = e.pageY;
    };

    document.onmouseup = (e) => {
      if (that.isHoldOnTopBar) {
        that.isHoldOnTopBar = false;
      }
    }
  }

  getValidActualX(value) {
    if (value < 0) {
      return 0;
    }
    let windowWidth = $(window).width();

    if (windowWidth < 260) {
      return 0;
    }

    if (value > (windowWidth - 260)) {
      return windowWidth - 260;
    }

    return value;
  }

  getValidActualY(value) {
    if (value < 0) {
      return 0;
    }
    let windowHeight = $(window).height();

    if (value > (windowHeight - 60)) {
      return windowHeight - 60;
    }

    return value;
  }

  render() {
    return (
      <div className="live-edit-nav-bar" style={{top: this.state.topBarY, left: this.state.topBarX, lineHeight: '1em'}}>
        <div className="top-bar"
             onMouseDown={() => this.isHoldOnTopBar = true}
             onMouseUp={() => this.isHoldOnTopBar = false}>Cms Nav Bar <div title="Close live edit" className="clear-live-edit" onClick={this.clearLiveEdit.bind(this)}>x</div></div>
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
    );
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

  clearLiveEdit() {
    window.location.search = '?live_edit_view=false&clear=true';
  }

}