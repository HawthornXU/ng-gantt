import { Injectable } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart/gantt-chart.define';

@Injectable({
  providedIn: 'root'
})
export class GanttService {

  constructor() {
  }


  getScaleUnitPixel(scaleUnit) {
    switch (scaleUnit) {
      case GanttChartConfig.GanttScaleUnit.day:
        return GanttChartConfig.BASIC_DAY_PIXEL * 7;
        break;
      case  GanttChartConfig.GanttScaleUnit.week:
        return GanttChartConfig.BASIC_DAY_PIXEL * 2;
        break;
      case  GanttChartConfig.GanttScaleUnit.month:
        return GanttChartConfig.BASIC_DAY_PIXEL;
        break;
      default:
        break;
    }
  }
}

