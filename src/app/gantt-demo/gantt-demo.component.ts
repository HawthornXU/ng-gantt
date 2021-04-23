import { Component, OnInit } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart';
import { GANTT_MOCK_DATA_BASIC } from './gannt-demo-mock-data';


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
    this.gantConfig.data = GANTT_MOCK_DATA_BASIC
  }

  changeScale(type: number) {

    this.gantConfig.scaleUnit = [GanttChartConfig.GanttScaleUnit.day, GanttChartConfig.GanttScaleUnit.week, GanttChartConfig.GanttScaleUnit.month][type];

  }

}
