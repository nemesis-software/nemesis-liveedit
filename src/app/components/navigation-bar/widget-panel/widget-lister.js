import React, { Component } from 'react';

import Widget from './widget';

export default class WidgetLister extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="widget-lister">
          {this.props.widgets.map((item)=> <Widget key={item.id} widget={item}/>)}
      </div>
    );
  }
}