import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
import _ from 'lodash';

import '../../styles/style.less';

injectTapEventPlugin();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.getElementSize();
    return (
      <MuiThemeProvider>
        <div>
          test
          <button style={{zIndex: '1001'}} onClick={() => {console.log('test'); this.setState({...this.state})}}>Calculate</button>
          <div style={{zIndex: '1000000', position: 'absolute', top: '100px', left: '0', width: '100%', height: '1000px'}}>
            {this.getSlotWrappers().map((wrapper, index) => {
              return <div key={index} data-id={wrapper.id} style={wrapper.style}></div>
            })}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    console.log('here update');
    this.setState({...this.state});
  }

  getElementSize() {
    let result = {slots: [], widgets: [], emptySlots: []};
    let slots = $('start-cms-slot');
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i].id) {
        continue;
      }
      let slotCoordinates = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};
      let slotWidgets = [];
      if ($((slots[i])).nextUntil('end-cms-slot').length === 1) {
        slotWidgets = $((slots[i])).nextUntil('end-cms-slot').children('start-cms-widget');
      } else {
        slotWidgets = $($(slots[i])).nextUntil('end-cms-slot', 'start-cms-widget');
      }

      if (slots[i].id === 'csid_' && slotWidgets.length > 0) {
        continue;
      }

      for (let j = 0; j < slotWidgets.length; j++) {
        let widget = $(slotWidgets[j]);
        let widgetElements = widget.nextUntil('end-cms-widget');
        let widgetCoordinate = this.getMaxCoordinate(widgetElements);
        if (_.isEqual(widgetCoordinate, {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0})) {
          continue;
        }
        result.widgets.push({id: slotWidgets[j].id, coordinate: widgetCoordinate});
        slotCoordinates = this.objectMaxCoordinates(slotCoordinates, widgetCoordinate);
      }
      if (slotWidgets.length > 0 && !_.isEqual(slotCoordinates, {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0})) {
        result.slots.push({id: slots[i].id, coordinate: slotCoordinates});
      } else {
        result.emptySlots.push({id: slots[i].id})
      }

      console.log('here1');

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
      let style = {
        position: 'absolute',
        border: '2px solid blue',
        top: (item.coordinate.top - 103 + window.pageYOffset) + 'px',
        left: (item.coordinate.left - 3) + 'px',
        width: (item.coordinate.right - item.coordinate.left + 6) + 'px',
        height: (item.coordinate.bottom - item.coordinate.top + 6) + 'px'
      };

      result.push({style:style, id: item.id});
    });

    _.forEach(wrappersCoordinate.widgets, item => {
      let style = {
        position: 'absolute',
        border: '1px solid red',
        top: (item.coordinate.top - 100 + window.pageYOffset) + 'px',
        left: item.coordinate.left + 'px',
        width: (item.coordinate.right - item.coordinate.left) + 'px',
        height: (item.coordinate.bottom - item.coordinate.top) + 'px'
      };

      result.push({style:style, id: item.id});
    });

    return result;
  }

}