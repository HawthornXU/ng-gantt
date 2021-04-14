import { Component, OnInit } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart';


@Component({
  selector: 'app-gantt-demo',
  templateUrl: './gantt-demo.component.html',
  styleUrls: ['./gantt-demo.component.scss']
})
export class GanttDemoComponent implements OnInit {

  gantConfig = {
    scaleUnit: GanttChartConfig.GanttScaleUnit.day,
    beginMoment: new Date('2021-01-01'),
    endMoment: new Date('2021-12-31'),
  }


  constructor() {
  }

  ngOnInit(): void {
  }

  changeScale(type: number) {

    this.gantConfig.scaleUnit = [GanttChartConfig.GanttScaleUnit.day, GanttChartConfig.GanttScaleUnit.week, GanttChartConfig.GanttScaleUnit.month][type];

  }

}
