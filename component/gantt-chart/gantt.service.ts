import { Injectable } from '@angular/core';
import { GanttChartConfig } from './gantt-chart.define';
import { Element, Group, Image, Line, Polyline, Rect, Text } from 'zrender';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import TASK_ROW_HEIGHT = GanttChartConfig.TASK_ROW_HEIGHT;
import COLOR_CONFIG = GanttChartConfig.COLOR_CONFIG;
import ELEMENT_Z_INDEX_TIER = GanttChartConfig.ELEMENT_Z_INDEX_TIER;
import TASK_TYPE = GanttChartConfig.TASK_TYPE;
import BASIC_TASK_PIXEL = GanttChartConfig.BASIC_TASK_PIXEL;
import TaskType = GanttChartConfig.TaskType;
import { differenceInDays } from "date-fns";

@Injectable()
export class GanttService {

  public scaleUnit = GanttChartConfig.GanttScaleUnit.day;

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

  drawMonthText(offset: number, monthString: string): Text {
    const text = new Text({
      z: ELEMENT_Z_INDEX_TIER.DateScale,
      style: {
        x: ++offset,
        y: 2,
        text: monthString,
        fill: GanttChartConfig.COLOR_CONFIG.DateTextColor
      },
    })
    return text
  }

  drawMonthScaleLine(offset: number): Line {
    const line = new Line({
      z: ELEMENT_Z_INDEX_TIER.MonthScaleLine,
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

  drawDateScaleBottomBorder(width: number): Group {
    const group = new Group()
    const rect = new Rect({
      z: ELEMENT_Z_INDEX_TIER.DateScale,
      style: {
        fill: COLOR_CONFIG.GanttBackgroundColor
      },
      shape: {
        x: 0,
        y: 0,
        width,
        height: 35.5
      }
    })
    const line = new Line({
      z: ELEMENT_Z_INDEX_TIER.DateScale,
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
    group.add(rect)
    group.add(line)
    return group
  }

  drawDateScaleLeftBorder(offset: number): Line {
    const line = new Line({
      z: ELEMENT_Z_INDEX_TIER.DateScale,
      shape: {
        x1: offset + 0.5,
        y1: GanttChartConfig.DAY_SCALE_START_Y_PIXEL,
        x2: offset + 0.5,
        y2: GanttChartConfig.DAY_SCALE_END_Y_PIXEL,
      },
      cursor: null,
      style: {
        stroke: GanttChartConfig.COLOR_CONFIG.DateLineColor,
      }
    })
    return line;
  }

  drawDayText(offset: number, dayString: number, scaleUnit: GanttChartConfig.GanttScaleUnit): Text {
    const text = new Text({
      z: ELEMENT_Z_INDEX_TIER.DateScale,
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

  drawNonworkdayBackground(x: number, scaleUnit: GanttChartConfig.GanttScaleUnit): Group {
    let scalePixel = this.getScaleUnitPixel(scaleUnit);
    const backgroundGroup = new Group({
      silent: true,
    })
    for (let lineDashOffset = 1; scalePixel > 0; x++, scalePixel--, lineDashOffset++) {
      const line = new Line({
        z: ELEMENT_Z_INDEX_TIER.NonWorkDayBackground,
        shape: {
          x1: x + 0.5,
          y1: 35.5,
          x2: x + 0.5,
          y2: window.screen.height * window.devicePixelRatio,
        },
        cursor: null,
        style: {
          stroke: GanttChartConfig.COLOR_CONFIG.WeekendColor,
          lineDash: [1.2, 5],
          lineDashOffset: lineDashOffset
        }
      })
      backgroundGroup.add(line)
    }
    return backgroundGroup;

  }

  drawTask(type: TASK_TYPE,x:number, y: number,  ganttWidth: number, xScrollGroup: Group, taskItem: TaskType) {

    const width = (differenceInDays(taskItem.endDate, taskItem.startDate) + 1) * this.getScaleUnitPixel(this.scaleUnit);
    const rowGroup = new Group()

    const raskBackGround = this.drawTaskRowBackground(y, ganttWidth)
    const task = this.drawTaskElement(type, x, y, width, taskItem.color)

    let highlightDateMark = this.drawHighlightDateMark(x, width);
    task.on('mouseover', e => {
      raskBackGround.trigger('mouseover');
      xScrollGroup.add(highlightDateMark)

    })
    task.on('mouseout', e => {
      raskBackGround.trigger('mouseout')
      xScrollGroup.remove(highlightDateMark)
    })

    rowGroup.add(task)
    rowGroup.add(raskBackGround)

    return rowGroup
  }

  private drawHighlightDateMark( x:number, taskWidth: number): Group {
    const group = new Group()
    const markRect = new Rect({
      z:ELEMENT_Z_INDEX_TIER.DateScale,
      style:{
        fill: COLOR_CONFIG.DateMarkColor,
      },
      shape:{
        r: 4,
        x: x,
        y: GanttChartConfig.DAY_SCALE_START_Y_PIXEL,
        width: taskWidth,
        height: GanttChartConfig.DAY_SCALE_END_Y_PIXEL - GanttChartConfig.DAY_SCALE_START_Y_PIXEL ,
      }
    })
    group.add(markRect)

    return group
  }

  private drawTaskElement(type: TASK_TYPE, x: number, y: number, taskWidth: number, color?: string): Element {
    const taskRelativeY = (GanttChartConfig.TASK_ROW_HEIGHT - GanttChartConfig.BASIC_TASK_PIXEL) / 2
    if (type == TASK_TYPE.Normal) {
      const taskElement = new Rect({
        z: ELEMENT_Z_INDEX_TIER.TaskItem,
        style: {
          fill: color ?? COLOR_CONFIG.TaskFillColor,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
          shadowBlur: 2,
          shadowColor: '#5170ff30'
        },
        shape: {
          r: 3,
          x,
          y: y + taskRelativeY,
          width: taskWidth,
          height: BASIC_TASK_PIXEL
        },
        draggable: 'horizontal'
      })
      taskElement.on('drag', e => {
        console.log(e);
      })
      return taskElement;
    }
    if (type == TASK_TYPE.Milestone) {
      const milestone = new Image({
        z: ELEMENT_Z_INDEX_TIER.TaskItem,
        x: x,
        // todo '24' replace to automatically computed values
        y: y + (TASK_ROW_HEIGHT - 22) / 2,
        style: {
          image: 'milestone.svg'
        },
        draggable: 'horizontal'
      })
      return milestone
    }
    if (type == TASK_TYPE.Abstract) {
      const abstractTaskEl = new Polyline({
        z: ELEMENT_Z_INDEX_TIER.TaskItem,
        x,
        y: y + taskRelativeY,
        style: {
          fill: COLOR_CONFIG.AbstractTaskFillColor,
          stroke: null
        },
        shape: {
          points: [[0, 0], [taskWidth, 0], [taskWidth, BASIC_TASK_PIXEL], [taskWidth - 6, BASIC_TASK_PIXEL / 3], [6, BASIC_TASK_PIXEL / 3], [0, BASIC_TASK_PIXEL]]
        }
      })
      return abstractTaskEl
    }

  }

  private drawTaskRowBackground(y: number, totalWidth: number) {
    const rect = new Rect({
      z: ELEMENT_Z_INDEX_TIER.TaskRowBackground,
      style: {
        fill: 'transparent',
        // opacity: 0,
      },
      shape: {
        x: 0,
        y,
        width: totalWidth,
        height: TASK_ROW_HEIGHT,
      },
      cursor: null,
    });
    rect.on('mouseout', e => {
      rect.attr({
        style: {
          fill: 'transparent'
        }
      })
    })
    rect.on('mouseover', e => {
      rect.attr({
        style: {
          fill: COLOR_CONFIG.TaskRowColor
        }
      })
    })

    return rect
  }
}

