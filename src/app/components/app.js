import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
import _ from 'lodash';
import SlotContainer from './slot-container';
import WidgetContainer from './widget-container';

import '../../styles/style.less';

injectTapEventPlugin();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div id="ala-bala" data-name="dataName" draggable="true" onDragStart={this.handleDragStart.bind(this)}>test</div>
          <button style={{zIndex: '1001'}} onClick={() => {console.log('test'); this.setState({...this.state})}}>Calculate</button>
          <div style={{zIndex: '1000000', position: 'absolute', top: '100px', left: '0', width: '100%', height: '1000px'}}>
            {this.getSlotWrappers().map((wrapper, index) => {
              if (wrapper.type === 'SLOT') {
                return <SlotContainer key={index} data={wrapper}/>
              } else if (wrapper.type === 'WIDGET') {
                return <WidgetContainer key={index} data={wrapper}/>
              } else {
                return <div>UNKNOWN TYPE</div>
              }
              {/*return <div onDragOver={this.handleDragover.bind(this)} onDrop={this.handleWidgetDrop.bind(this)} key={index} data-id={wrapper.id} style={wrapper.style}></div>*/}
            })}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  handleWidgetDrop(event) {
    console.log(event.target);
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("itemId"));
    console.log(data.id);
  }

  handleDragStart(event) {
    event.dataTransfer.setData("itemId", JSON.stringify({id: event.target.id}));
  }

  handleDragover(event) {
    event.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    this.setState({...this.state});
  }

  getElementSize() {
    let result = {slots: [], widgets: [], emptySlots: []};
    let slots = $('start-cms-slot');
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i].id) {
        continue;
      }
      let slotId = slots[i].id;
      let slotCoordinates = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};
      let slotWidgets = [];
      if ($((slots[i])).nextUntil('end-cms-slot').length === 1) {
        slotWidgets = $((slots[i])).nextUntil('end-cms-slot').children('start-cms-widget');
      } else {
        slotWidgets = $($(slots[i])).nextUntil('end-cms-slot', 'start-cms-widget');
      }

      if (slots[i].id === 'empty-slot' && slotWidgets.length > 0) {
        continue;
      }

      for (let j = 0; j < slotWidgets.length; j++) {
        let widget = $(slotWidgets[j]);
        let widgetElements = widget.nextUntil('end-cms-widget');
        let widgetCoordinate = this.getMaxCoordinate(widgetElements);
        if (_.isEqual(widgetCoordinate, {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0})) {
          continue;
        }
        result.widgets.push({id: slotWidgets[j].id, coordinate: widgetCoordinate, slotId: slotId });
        slotCoordinates = this.objectMaxCoordinates(slotCoordinates, widgetCoordinate);
      }
      if (slotWidgets.length > 0 && !_.isEqual(slotCoordinates, {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0})) {
        result.slots.push({id: slotId, coordinate: slotCoordinates});
      } else {
        result.emptySlots.push({id: slotId})
      }

    }
    return result;
  }

  getMaxCoordinate(elements) {
    let result = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};
    for (let i = 0; i < elements.length; i++) {
      let elementCoordinates = elements[i].getBoundingClientRect();
      if (elementCoordinates.top === 0 && elementCoordinates.bottom === 0 && elementCoordinates.right === 0 && elementCoordinates.left === 0 ) {
        continue;
      }
      result = this.objectMaxCoordinates(result, elementCoordinates);
    }

    return result;
  }

  objectMaxCoordinates(first, second) {
    return {
      top: Math.min(first.top, second.top),
      left: Math.min(first.left, second.left),
      right: Math.max(first.right, second.right),
      bottom: Math.max(first.bottom, second.bottom)
    };
  }

  getSlotWrappers() {
    let wrappersCoordinate = this.getElementSize();
    let result = [];
    _.forEach(wrappersCoordinate.slots, item => {
      result.push({type: 'SLOT', id: item.id, coordinate: this.getItemCoordinate(item)});
    });

    _.forEach(wrappersCoordinate.widgets, item => {
      result.push({type: 'WIDGET', id: item.id, coordinate: this.getItemCoordinate(item), slotId: item.slotId});
    });

    return result;
  }

  getItemCoordinate(item) {
    return {
      top: (item.coordinate.top - 100 + window.pageYOffset),
      left: item.coordinate.left,
      width: (item.coordinate.right - item.coordinate.left),
      height: (item.coordinate.bottom - item.coordinate.top)
    }
  }

}