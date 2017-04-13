import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
import _ from 'lodash';
import SlotContainer from './slot-container';
import WidgetContainer from './widget-container';
import Toggle from 'material-ui/Toggle';

import '../../styles/style.less';

injectTapEventPlugin();

const initialElementSize = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: 0, bottom: 0};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isLiveEditEnabled: false, showAllSlots: false}
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <Toggle
              style={{width: '100px'}}
              label="Live edit"
              onToggle={((ev, value) => this.setState({...this.state, isLiveEditEnabled: value}))}
            />
            <Toggle
              style={{width: '100px'}}
              label="Show All"
              disabled={!this.state.isLiveEditEnabled}
              onToggle={this.handleToggleShowAll.bind(this)}
            />
          </div>
          {this.state.isLiveEditEnabled ? <div style={{zIndex: '1000000', position: 'absolute', top: '100px', left: '0', width: '100%', height: '1000px'}}>
            {this.getCmsElements().map((element, index) => {
              if (element.type === 'SLOT') {
                return <SlotContainer key={index} data={element}/>
              } else if (element.type === 'WIDGET') {
                return <WidgetContainer key={index} data={element}/>
              } else {
                return <div>UNKNOWN TYPE</div>
              }
            })}
          </div> : false}
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
    this.setState({...this.state});
  }

  handleToggleShowAll(ev, value) {
    let emptySlots = this.getAllEmptySlots();
    let emptyWidgets = this.getEmptyWidgets();
    if (value) {
      $(emptySlots).addClass('empty-slot-container');
      $(emptyWidgets).addClass('empty-widget-container');
    } else {
      $(emptySlots).removeClass('empty-slot-container');
      $(emptyWidgets).removeClass('empty-widget-container');
    }
    this.setState({...this.state, showAllSlots: value});
  }

  getElementSize() {
    let result = {slots: [], widgets: [], emptySlots: []};
    let slots = $('start-cms-slot');
    for (let i = 0; i < slots.length; i++) {
      let slotId = slots[i].id;

      if (!slotId) {
        continue;
      }

      let slotCoordinates = {...initialElementSize};
      let slotWidgets = this.getSlotWidgets(slots[i]);

      if (slots[i].id === 'empty-slot' && slotWidgets.length > 0) {
        continue;
      }

      for (let j = 0; j < slotWidgets.length; j++) {
        let widgetElements = this.getWidgetElements(slotWidgets[j]);
        let widgetCoordinate;
        if (widgetElements.length === 0 && this.state.showAllSlots) {
          widgetCoordinate = slotWidgets[j].getBoundingClientRect();
        } else {
          widgetCoordinate = this.getMaxCoordinate(widgetElements);
        }

        if (_.isEqual(widgetCoordinate, initialElementSize)) {
          continue;
        }

        result.widgets.push({id: slotWidgets[j].id, coordinate: widgetCoordinate, slotId: slotId });
        slotCoordinates = this.objectMaxCoordinates(slotCoordinates, widgetCoordinate);
      }

      if (slotWidgets.length > 0 && !_.isEqual(slotCoordinates, initialElementSize)) {
        result.slots.push({id: slotId, coordinate: slotCoordinates});
      } else if (slotWidgets.length === 0) {
        result.emptySlots.push({id: slotId, coordinate: slots[i].getBoundingClientRect()})
      }

    }
    return result;
  }

  getAllEmptySlots() {
    let slots = $('start-cms-slot');
    let result = [];
    for (var i = 0; i < slots.length; i++) {
      let slot = slots[i];
      if ($((slot)).nextUntil('end-cms-slot').length === 0) {
        result.push(slot);
      }
    }

    return result;
  }

  getEmptyWidgets() {
    let widgets = $('start-cms-slot:not("empty-slot")').nextUntil('end-cms-slot', 'start-cms-widget');
    let result = [];
    for (var i = 0; i < widgets.length; i++) {
      let widget = widgets[i];
      if ($((widget)).nextUntil('end-cms-widget').length === 0) {
        result.push(widget);
      }
    }

    return result;
  }

  getMaxCoordinate(elements) {
    let result = {...initialElementSize};
    for (let i = 0; i < elements.length; i++) {
      let elementCoordinates = elements[i].getBoundingClientRect();
      if (elementCoordinates.top === 0 && elementCoordinates.bottom === 0 && elementCoordinates.right === 0 && elementCoordinates.left === 0 ) {
        continue;
      }
      result = this.objectMaxCoordinates(result, elementCoordinates);
    }

    return result;
  }

  getSlotWidgets(slot) {
    if ($((slot)).nextUntil('end-cms-slot').length === 1) {
      return $((slot)).nextUntil('end-cms-slot').children('start-cms-widget');
    }

    return $($(slot)).nextUntil('end-cms-slot', 'start-cms-widget');
  }

  getWidgetElements(widgetElement) {
    let widget = $(widgetElement);
    let widgetElements = widget.nextUntil('end-cms-widget');

    if (widgetElements.length === 1 && $(widgetElements[0]).is('a') && $(widgetElements[0]).children().length === 1 && $($(widgetElements[0]).children()[0]).is('img')) {
      widgetElements.push($(widgetElements[0]).children()[0]);
    }

    return widgetElements;
  }

  objectMaxCoordinates(first, second) {
    return {
      top: Math.min(first.top, second.top),
      left: Math.min(first.left, second.left),
      right: Math.max(first.right, second.right),
      bottom: Math.max(first.bottom, second.bottom)
    };
  }

  getCmsElements() {
    let elementsCoordinate = this.getElementSize();
    let result = [];
    _.forEach(elementsCoordinate.slots, item => {
      result.push({type: 'SLOT', id: item.id, coordinate: this.getItemCoordinate(item)});
    });

    _.forEach(elementsCoordinate.widgets, item => {
      result.push({type: 'WIDGET', id: item.id, coordinate: this.getItemCoordinate(item), slotId: item.slotId});
    });
    if (this.state.showAllSlots) {
      _.forEach(elementsCoordinate.emptySlots, item => {
        result.push({type: 'SLOT', id: item.id, coordinate: this.getItemCoordinate(item)});
      });
    }

    return result;
  }

  getItemCoordinate(item) {
    return {
      top: (item.coordinate.top - 100 + window.pageYOffset),
      left: (item.coordinate.left + window.pageXOffset),
      width: (item.coordinate.right - item.coordinate.left),
      height: (item.coordinate.bottom - item.coordinate.top)
    }
  }
}