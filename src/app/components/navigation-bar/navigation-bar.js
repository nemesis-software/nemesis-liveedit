import React, { Component } from 'react';
import WidgetPanel from './widget-panel/widget-panel';
import PersonalizationPanel from './personalization-panel/personalization-panel';
import NavigationBottomBar from './navigation-bottom-bar';
import IndexQueryConfig from "source/app/components/index-query-config/index-query-config";

const LIVE_EDIT = 'live_edit';
const SEARCH_CONFIG = 'search_config';
const PERSONALIZATION = 'personalization';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    let searchDataContainer = document.getElementById('search-live-edit-meta');
    this.state = {topBarX: 20, topBarY: 100, viewType: LIVE_EDIT, hasSearchData: !!searchDataContainer };
    this.mouseY = 0;
    this.mouseX = 0;
    this.isHoldOnTopBar = false;
  }

  componentWillMount() {
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
             onMouseUp={() => this.isHoldOnTopBar = false}>
          Cms Nav Bar
          <div title="Close live edit" className="clear-live-edit" onClick={this.clearLiveEdit.bind(this)}>x</div>
          <div title="SwitchView" className="switch-personalization" onClick={() => this.onViewSwitch(PERSONALIZATION)}>
            {this.state.viewType === PERSONALIZATION ? <i className="material-icons">settings</i> : <i className="material-icons">person</i>}
          </div>
          {this.state.hasSearchData ? <div title="SwitchView" className="switch-search" onClick={() => this.onViewSwitch(SEARCH_CONFIG)}>
            {this.state.viewType === SEARCH_CONFIG ? <i className="material-icons">settings</i> : <i className="material-icons">search</i>}
          </div> : false}
        </div>
        <WidgetPanel onToggleShowAll={this.props.onToggleShowAll} onToggleLiveEdit={this.props.onToggleLiveEdit} setDragState={this.props.setDragState} isHidden={this.state.viewType !== LIVE_EDIT}/>
        <PersonalizationPanel isHidden={this.state.viewType !== PERSONALIZATION}/>
        {this.state.hasSearchData ? <IndexQueryConfig isHidden={this.state.viewType !== SEARCH_CONFIG}/> : false}
        {this.state.viewType !== SEARCH_CONFIG ? <hr/> : false}
        <NavigationBottomBar isHidden={this.state.viewType === SEARCH_CONFIG}/>
      </div>
    );
  }

  clearLiveEdit() {
    window.location.search = '?live_edit_view=false&clear=true';
  }

  onViewSwitch(viewType) {
    if (this.state.viewType === viewType) {
      this.setState({viewType: LIVE_EDIT});
    } else {
      this.setState({viewType: viewType});
    }
  }

}