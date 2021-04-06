import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttDemoComponent } from './gantt-demo.component';
import { RouterModule } from '@angular/router';
import { GanttChartModule } from 'component/gantt-chart/gantt-chart.module';


@NgModule({
  declarations: [GanttDemoComponent],
  imports: [
    CommonModule,
    GanttChartModule,
    RouterModule.forChild(
      [
        {path: '', component: GanttDemoComponent}
      ])
  ]
})
export class GanttDemoModule {
}
