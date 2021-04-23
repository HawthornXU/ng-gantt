import { Component, OnInit } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart';


@Component({
  selector: 'app-gantt-demo',
  templateUrl: './gantt-demo.component.html',
  styleUrls: ['./gantt-demo.component.scss']
})
export class GanttDemoComponent implements OnInit {

  currentYear = new Date().getFullYear();

  gantConfig = {
    scaleUnit: GanttChartConfig.GanttScaleUnit.day,
    beginMoment: new Date(this.currentYear, 0, 1),
    endMoment: new Date(this.currentYear, 11, 31),
    data: [] as Array<GanttChartConfig.TaskType>,
  }


  constructor() {
  }

  ngOnInit(): void {
    this.gantConfig.data = [
      {
        id: '1',
        startDate: new Date(this.currentYear, 0, 20),
        endDate: new Date(this.currentYear, 0, 20),
        type: GanttChartConfig.TASK_TYPE.Normal
      },
      {
        id: '2',
        startDate: new Date(this.currentYear, 0, 21),
        endDate: new Date(this.currentYear, 0, 26),
        type: GanttChartConfig.TASK_TYPE.Abstract
      },
      {
        id: '3',
        startDate: new Date(this.currentYear, 0, 21),
        endDate: new Date(this.currentYear, 0, 21),
        type: GanttChartConfig.TASK_TYPE.Normal
      },
      {
        id: '4',
        startDate: new Date(this.currentYear, 0, 22),
        endDate: new Date(this.currentYear, 0, 22),
        type: GanttChartConfig.TASK_TYPE.Milestone
      },
      {
        id: '5',
        startDate: new Date(this.currentYear, 0, 22),
        endDate: new Date(this.currentYear, 0, 26),
        type: GanttChartConfig.TASK_TYPE.Abstract
      },
      {
        id: '6',
        startDate: new Date(this.currentYear, 0, 22),
        endDate: new Date(this.currentYear, 0, 22),
        type: GanttChartConfig.TASK_TYPE.Normal
      },
      {
        id: '7',
        startDate: new Date(this.currentYear, 0, 25),
        endDate: new Date(this.currentYear, 0, 25),
        type: GanttChartConfig.TASK_TYPE.Normal
      },
      {
        id: '8',
        startDate: new Date(this.currentYear, 0, 26),
        endDate: new Date(this.currentYear, 0, 26),
        type: GanttChartConfig.TASK_TYPE.Normal
      },
    ]
  }

  changeScale(type: number) {

    this.gantConfig.scaleUnit = [GanttChartConfig.GanttScaleUnit.day, GanttChartConfig.GanttScaleUnit.week, GanttChartConfig.GanttScaleUnit.month][type];

  }

}
