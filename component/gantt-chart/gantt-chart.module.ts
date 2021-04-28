import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttChartComponent } from './gantt-chart.component';
import { GanttService } from './gantt.service';
import { GanttScrollThumbModule } from '../gantt-scroll-thumb';


@NgModule({
  declarations: [GanttChartComponent],
  imports: [
    CommonModule,
    GanttScrollThumbModule
  ],
  exports: [GanttChartComponent],
  providers: [GanttService]
})
export class GanttChartModule {
}
