
export module GanttChartConfig{

  export const BASIC_DAY_PIXEL = 6;
  export const BASIC_TASK_PIXEL = 18;



  export enum GanttScaleUnit {
    day = 'day',
    week = 'week',
    month = 'month'
  }

  export interface TaskSourceType {
    id: string;
    name: string;
    ganttType: string;
    children?: any;
    start: Date;
    end: Date;
    color: string;
    actualStart?: Date;
    actualEnd?: Date;
    actualColor?: string;
    isShowChilren?: boolean;
  }

  export enum COLOR_CONFIG {
    DateLineColor = '#e9edfa',
    DateTextColor = '#8a8e99',
    WeekendColor = '#e9edfa',
    MonthLineColor = '#adb0b8'
  }

}
