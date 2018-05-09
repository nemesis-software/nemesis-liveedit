import React, { Component } from 'react';
import WidgetPanel from './widget-panel/widget-panel';
import PersonalizationPanel from './personalization-panel/personalization-panel';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {topBarX: 20, topBarY: 100, isPersonalizationView: false};
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
          <div title="SwitchView" className="switch-view" onClick={this.onViewSwitch.bind(this)}>
            {this.state.isPersonalizationView ? <i className="material-icons">settings</i> : <i className="material-icons">person</i>}
          </div>
        </div>
        <WidgetPanel onToggleShowAll={this.props.onToggleShowAll} onToggleLiveEdit={this.props.onToggleLiveEdit} isHidden={this.state.isPersonalizationView}/>
        <PersonalizationPanel isHidden={!this.state.isPersonalizationView}/>
      </div>
    );
  }

  clearLiveEdit() {
    window.location.search = '?live_edit_view=false&clear=true';
  }

  onViewSwitch() {
    this.setState({isPersonalizationView: !this.state.isPersonalizationView});
  }

}