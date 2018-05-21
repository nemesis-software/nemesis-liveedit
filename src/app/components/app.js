import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import SlotContainer from './slot-container';
import WidgetContainer from './widget-container';
import MessageSourceContainer from './message-source-container';
import NavigationBar from './navigation-bar/navigation-bar';

import 'react-select/dist/react-select.css';

import '../../styles/style.less';


const initialElementSize = {top: Number.MAX_VALUE, left: Number.MAX_VALUE, right: -1000000, bottom: -1000000};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isLiveEditEnabled: false, showAllSlots: false}
  }

  componentWillMount() {
    let urlVars = this.getUrlVars();
    if (urlVars['token']) {
      localStorage.setItem('privateToken', urlVars['token']);
    }
  }

  render() {
    return (
      <div style={{zIndex: 100000000}}>
        <NavigationBar onToggleShowAll={this.onToggleShowAll.bind(this)} onToggleLiveEdit={this.onToggleLiveEdit.bind(this)}/>
        {this.state.isLiveEditEnabled ? <div style={{zIndex: '10000', position: 'absolute', top: '0', left: '0', width: '0', height: '0'}}>
          {this.getCmsElements().map((element, index) => {
            if (element.type === 'SLOT') {
              return <SlotContainer key={index} data={element}/>
            } else if (element.type === 'WIDGET') {
              return <WidgetContainer key={index} data={element}/>
            } else if (element.type === 'MESSAGE_SOURCE') {
              return <MessageSourceContainer key={index} data={element}/>
            } else {
              return <div>UNKNOWN TYPE</div>
            }
          })}
        </div> : false}
      </div>
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

  onToggleLiveEdit() {
    this.setState({...this.state, isLiveEditEnabled: !this.state.isLiveEditEnabled});
  }

  onToggleShowAll() {
    let value = !this.state.showAllSlots;
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
      let slotPageId = slots[i].getAttribute('pageId');
      let slotTemplateId = slots[i].getAttribute('templateId');
      let slotPosition = slots[i].getAttribute('dto-position');
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
        if ( (widgetElements.length === 0 && slotWidgets[j].nextSibling.nodeValue)) {
          widgetCoordinate = this.getCoordinateForSimpleTextWidget(slotWidgets[j]);
        } else if ( (widgetElements.length === 0 && this.state.showAllSlots)) {
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
        result.slots.push({id: slotId, pageId: slotPageId, templateId: slotTemplateId, coordinate: slotCoordinates});
      } else if (slotWidgets.length === 0) {
        result.emptySlots.push({id: slotId, slotPosition: slotPosition, coordinate: slots[i].getBoundingClientRect()})
      }

    }
    return result;
  }

  getAllEmptySlots() {
    let slots = $('start-cms-slot');
    let result = [];
    for (let i = 0; i < slots.length; i++) {
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
    for (let i = 0; i < widgets.length; i++) {
      let widget = widgets[i];
      if ($((widget)).nextUntil('end-cms-widget').length === 0 && (!widget.nextSibling || !widget.nextSibling.nodeValue)) {
        result.push(widget);
      }
    }

    return result;
  }

  getCoordinateForSimpleTextWidget(widget) {
    let coordinate = widget.getBoundingClientRect();
    return {
      top: coordinate.top,
      left: coordinate.left,
      bottom: coordinate.bottom + 17,
      right: coordinate.right + 70,
    };
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
      result.push({type: 'SLOT', id: item.id, pageId: item.pageId, templateId: item.templateId, coordinate: this.getItemCoordinate(item)});
    });

    _.forEach(elementsCoordinate.widgets, item => {
      result.push({type: 'WIDGET', id: item.id, coordinate: this.getItemCoordinate(item), slotId: item.slotId});
    });
    if (this.state.showAllSlots) {
      _.forEach(elementsCoordinate.emptySlots, item => {
        result.push({type: 'SLOT', id: item.id, slotPosition: item.slotPosition, coordinate: this.getItemCoordinate(item)});
      });
    }

    return result.concat(this.getMessageSources());
  }

  getMessageSources() {
    let result = [];
    let messageSources = $('message-source-property');
    for (let i = 0; i < messageSources.length; i++) {
      let messageSource = messageSources[i];
      let messageSourceId = messageSources[i].getAttribute('id');
      result.push({type: 'MESSAGE_SOURCE', id: messageSourceId, coordinate: this.getItemCoordinate({coordinate: messageSource.getBoundingClientRect()})});
    }

    return result;
  }

  getItemCoordinate(item) {
    let result = {
      top: (item.coordinate.top + window.pageYOffset),
      left: (item.coordinate.left + window.pageXOffset),
      width: (item.coordinate.right - item.coordinate.left),
      height: (item.coordinate.bottom - item.coordinate.top)
    };

    if (result.top < 0 && item.coordinate.bottom > 0) {
      console.log(item.coordinate);
      result.top = 5;
    }

    if (result.left < 0 && item.coordinate.right > 0) {
      console.log(item.coordinate);
      result.left = 5;
    }

    return result;
  }


  getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
}