import ApiCall from './api-call';
import _ from 'lodash';

export default class SlotService {
  static addWidgetToSlot(slotId, widgetId) {
    return this.getSlotWidgets(slotId).then(widgets => {
      let allWidgetsIds = widgets.map(item => item.id);
      allWidgetsIds.push(widgetId);
      return this.updateSlotWidgets(slotId, allWidgetsIds);
    });
  }

  static removeWidgetFromSlot(slotId, widgetId) {
    return this.getSlotWidgets(slotId).then(widgets => {
      let allWidgetsIds = widgets.map(item => item.id);
      let indexOfWidget = allWidgetsIds.indexOf(widgetId);
      if (indexOfWidget > -1) {
        allWidgetsIds.splice(indexOfWidget, 1);
      }
      return this.updateSlotWidgets(slotId, allWidgetsIds);
    });
  }

  static initializeSlot(slotCode, slotPosition, widgetId, pageId, templateId) {
    let urlForCatalog = !!pageId ? `cms_page/${pageId}/catalogVersion` : `cms_template/${templateId}/catalogVersion`;
    return ApiCall.get(urlForCatalog).then(result => {
      return result.data.content.id;
    }).then(catalogId => {
      let newSlot = {
        active: true,
        code: slotCode,
        catalogVersion: catalogId,
        position: slotPosition,
        widgets: [widgetId]
      };

      if (pageId) {
        newSlot.page = pageId;
      } else {
        newSlot.template = templateId;
      }

      return ApiCall.post('cms_slot', newSlot)
    });
  }

  static changeWidgetSlot(oldSlotId, newSlotId, widgetId) {
    return this.addWidgetToSlot(newSlotId, widgetId).then(result => {
      return this.removeWidgetFromSlot(oldSlotId, widgetId);
    })
  }

  static updateSlotWidgets(slotId, widgetIds) {
    return ApiCall.patch(`cms_slot/${slotId}`, {widgets: widgetIds});
  }

  static getSlotWidgets(slotId) {
    return ApiCall.get(`cms_slot/${slotId}/widgets`).then(result => {
      return this.mapCollectionData(result.data);
    });
  }

  static mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }
}