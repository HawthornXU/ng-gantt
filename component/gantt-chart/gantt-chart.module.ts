import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttChartComponent } from './gantt-chart.component';
import { GanttService } from './gantt.service';


@NgModule({
  declarations: [GanttChartComponent],
  imports: [
    CommonModule
  ],
  exports: [GanttChartComponent],
  providers: [GanttService]
})
export class GanttChartModule {
}
