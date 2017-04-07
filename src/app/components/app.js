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
    console.log('rerender');
    this.getElementSize();
    return (
      <MuiThemeProvider>
        <div>
          test
          <button style={{zIndex: '1001'}} onClick={() => {console.log('test')}}>Calculate</button>
          <div style={{zIndex: '1000', position: 'absolute', top: '0', left: '0', width: '100%', height: '1000px'}}>
            {this.getSlotWrappers().map((wrapper, index) => {
              return <div key={index} style={wrapper.style}></div>
            })}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  getElementSize() {
    let result = [];
    let slots = $('start-cms-slot');
    for (var i = 0; i < slots.length; i++) {
      result.push(this.getMaxCoordinate($(slots[i]).nextUntil('end-cms-slot')));
    }

    return result;
  }

  getMaxCoordinate(items) {
    let childrenMax = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};
    let parentMax = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};
    for (let i = 0; i < items.length; i++) {
      childrenMax =  this.maxObject(childrenMax, this.getMaxCoordinate($(items[i]).children()));
      parentMax = this.maxObject(parentMax, items[i].getBoundingClientRect());
    }

    return this.maxObject(childrenMax, parentMax);
  }

  maxObject(first, second) {
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
    _.forEach(wrappersCoordinate, item => {
      let style = {
        position: 'absolute',
        border: '1px solid black',
        top: item.top,
        left: item.left,
        width: item.right - item.left,
        height: item.bottom - item.top
      };

      result.push({style:style});
    });

    return result;
  }

  componentDidMount() {
    this.getElementSize();
    this.setState({...this.state})
  }

}