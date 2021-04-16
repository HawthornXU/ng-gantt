import { Injectable } from '@angular/core';
import { GanttChartConfig } from './gantt-chart.define';
import { Line, Text, ZRenderType, Group ,Rect } from 'zrender';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import TASK_ROW_HEIGHT = GanttChartConfig.TASK_ROW_HEIGHT;
import COLOR_CONFIG = GanttChartConfig.COLOR_CONFIG;
import ELEMENT_Z_INDEX_TIER = GanttChartConfig.ELEMENT_Z_INDEX_TIER;

@Injectable()
export class GanttService {

  constructor() {
  }


  getScaleUnitPixel(scaleUnit: GanttChartConfig.GanttScaleUnit) {
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

  drawMonthText(offset: number, monthString: string):Text {
    const text = new Text({
      style: {
        x: ++offset,
        y: 2,
        text: monthString,
        fill: GanttChartConfig.COLOR_CONFIG.DateTextColor
      },
    })
    return text
  }

  drawMonthScaleLine( offset: number):Line {
    const line = new Line({
      z:ELEMENT_Z_INDEX_TIER.MonthScaleLine,
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
    return line;
  }

  drawDateScaleBottomBorder(width: number):Line {
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
    return line
  }

  drawDateScaleLeftBorder(offset: number): Line {
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
    return line;
  }

  drawDayText( offset: number, dayString: number, scaleUnit: GanttChartConfig.GanttScaleUnit):Text {
    const text = new Text({
      style: {
        x: offset + this.getScaleUnitPixel(scaleUnit) / 2,
        y: 20,
        text: dayString.toString(),
        fontSize: '12px',
        fontFamily: 'Microsoft YaHei',
        fill: GanttChartConfig.COLOR_CONFIG.DateTextColor,
        align: scaleUnit == GanttScaleUnit.month ? 'left' : 'center',
      }
    })
    return text
  }

  drawNonworkdayBackground( x: number, scaleUnit: GanttChartConfig.GanttScaleUnit):Group {
    let scalePixel = this.getScaleUnitPixel(scaleUnit);
    const backgroundGroup = new Group({
      silent:true,
    })
    for (let lineDashOffset = 1; scalePixel > 0; x++, scalePixel--, lineDashOffset++) {
      const line = new Line({
        z:ELEMENT_Z_INDEX_TIER.NonWorkDayBackground,
        shape: {
          x1: x + 0.5,
          y1: 35.5,
          x2: x + 0.5,
          y2: window.screen.height * window.devicePixelRatio,
        },
        cursor: null,
        style: {
          stroke: GanttChartConfig.COLOR_CONFIG.WeekendColor,
          lineDash: [1, 5],
          lineDashOffset: lineDashOffset
        }
      })
      backgroundGroup.add(line)
    }
    return backgroundGroup;

  }

  drawTaskRowBackground(totalWidth: number):Group {
    const rowBackgroundGroup = new Group()
    for (let rowBeginY = 35.5; rowBeginY < window.screen.height; rowBeginY += TASK_ROW_HEIGHT) {
      const rect = new Rect({
        z:ELEMENT_Z_INDEX_TIER.TaskRowBackground,
        style: {
          fill: COLOR_CONFIG.TaskRowColor,
          opacity: 0
        },
        shape: {
          x: 0,
          y: rowBeginY,
          width: totalWidth,
          height: TASK_ROW_HEIGHT,
        },
      });
      rect.on('mouseout', e => {
        rect.attr({
          style:{
            opacity: 0
          }
        })
      })
      rect.on('mouseover', e => {
        rect.attr({
          style:{
            opacity: 1
          }
        })
      })
      rowBackgroundGroup.add(rect)
    }
    return rowBackgroundGroup
  }
}

