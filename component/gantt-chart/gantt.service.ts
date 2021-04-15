import { Injectable } from '@angular/core';
import { GanttChartConfig } from './gantt-chart.define';
import { Line, Text, ZRenderType } from 'zrender';

@Injectable()
export class GanttService {

  constructor() {
  }


  getScaleUnitPixel(scaleUnit:GanttChartConfig.GanttScaleUnit) {
    switch (scaleUnit) {
      case GanttChartConfig.GanttScaleUnit.day:
        return GanttChartConfig.BASIC_DAY_PIXEL * 5;
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

  drawMonthText(zCanvas: ZRenderType, offset: number, monthString: string) {
    const text = new Text({
      style: {
        x: ++offset,
        y: 2,
        text: monthString,
        fill: GanttChartConfig.COLOR_CONFIG.DateTextColor
      },
    })
    zCanvas.add(text);
  }

  drawMonthScaleLine(zCanvas: ZRenderType, offset: number) {
    const line = new Line({
      shape: {
        x1: offset + 0.5,
        y1: 35.5,
        x2: offset + 0.5,
        y2: window.screen.height * window.devicePixelRatio,
      },
      cursor: null,
      style: {
        stroke: GanttChartConfig.COLOR_CONFIG.MonthLineColor,
      }
    })
    zCanvas.add(line)
  }

  drawDateScaleBottomBorder(zCanvas: ZRenderType, width:number) {
    const line = new Line({
      shape: {
        x1: 0,
        y1: 35.5,
        x2: width,
        y2: 35.5,
      },
      cursor: null,
      style: {
        stroke: GanttChartConfig.COLOR_CONFIG.DateLineColor,
      }
    })
    zCanvas.add(line)
  }

  drawDateScaleLeftBorder(zCanvas: ZRenderType, offset: number) {
    const line = new Line({
      shape: {
        x1: offset + 0.5,
        y1: 18,
        x2: offset + 0.5,
        y2: 35,
      },
      cursor: null,
      style: {
        stroke: GanttChartConfig.COLOR_CONFIG.DateLineColor,
      }
    })
    zCanvas.add(line)
  }

  drawDayText(zCanvas: ZRenderType, offset: number, dayString: number,scaleUnit:GanttChartConfig.GanttScaleUnit) {
    const text = new Text({
      style: {
        x: offset+this.getScaleUnitPixel(scaleUnit)/2,
        y: 20,
        text: dayString.toString(),
        fontSize: '12px',
        fontFamily: 'Microsoft YaHei',
        fill: GanttChartConfig.COLOR_CONFIG.DateTextColor,
        align:'center'
      }
    })
    zCanvas.add(text);
  }

  drawNonworkdayBackground(zCanvas: ZRenderType, x: number,scaleUnit:GanttChartConfig.GanttScaleUnit) {
    let scalePixel = this.getScaleUnitPixel(scaleUnit)
    for(let lineDashOffset = 1;scalePixel>0;x++,scalePixel--,lineDashOffset++){
      const line = new Line({
        shape: {
          x1: x + 0.5,
          y1: 35.5,
          x2: x + 0.5,
          y2: window.screen.height * window.devicePixelRatio,
        },
        cursor: null,
        style: {
          stroke: GanttChartConfig.COLOR_CONFIG.WeekendColor,
          lineDash: [1,5],
          lineDashOffset:lineDashOffset
        }
      })
      zCanvas.add(line)
    }

  }
}

