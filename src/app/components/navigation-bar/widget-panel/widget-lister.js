import React, {Component} from 'react';

import Widget from './widget';
import AddNewWidget from "source/app/components/navigation-bar/widget-panel/add-new-widget";
import CreateNewPage from "source/app/components/navigation-bar/widget-panel/create-new-page";
import SynchronizeCatalogs from "source/app/components/navigation-bar/widget-panel/synchronize-catalogs";

export default class WidgetLister extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="widget-lister">
        {this.props.widgets.map((item) => <Widget setDragState={this.props.setDragState} key={item.id} widget={item}/>)}
        <AddNewWidget/>
        <hr />
        <CreateNewPage/>
        <hr />
        <SynchronizeCatalogs/>
      </div>
    );
  }
}
