export module GanttChartConfig {

  export const BASIC_DAY_PIXEL = 5;
  export const BASIC_TASK_PIXEL = 12;
  export const TASK_ROW_HEIGHT = 21;

  export enum GanttScaleUnit {
    day = 'day',
    week = 'week',
    month = 'month'
  }

  export interface TaskType {
    id: string;
    name?: string;
    startDate: Date;
    endDate: Date;
    /***
     * @default emun value COLOR_CONFIG.TaskFillColor
     */
    color?: string;
    type: TASK_TYPE;
    // isShowChildren?: boolean;
    // children: Array<TaskType>
  }

  export enum COLOR_CONFIG {
    DateLineColor = '#e9edfa',
    DateTextColor = '#8a8e99',
    WeekendColor = '#e9edfa',
    MonthLineColor = '#adb0b8',
    TaskFillColor = '#5e7ce0',
    TaskRowColor = '#f2f5fc',
    AbstractTaskFillColor = '#cacfd8',
    ScrollThumbDefault = '#cbcdd1'
  }

  export enum TASK_TYPE {
    Normal,
    Abstract,
    Milestone
  }

  /***
   * @description control element tier relationship, mast use default number type enum, To insert the tier at will.
   */
  export enum ELEMENT_Z_INDEX_TIER {
    TaskRowBackground,
    NonWorkDayBackground,
    MonthScaleLine,
    TaskItem,
    DateScale,
    ScrollThumb
  }

}
