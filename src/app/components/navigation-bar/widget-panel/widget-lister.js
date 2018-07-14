import React, {Component} from 'react';

import Widget from './widget';
import AddNewWidget from "source/app/components/navigation-bar/widget-panel/add-new-widget";

export default class WidgetLister extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="widget-lister">
        {this.props.widgets.map((item) => <Widget key={item.id} widget={item}/>)}
        <hr/>
        <AddNewWidget/>
      </div>
    );
  }
}