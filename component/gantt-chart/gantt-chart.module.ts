import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttChartComponent } from './gantt-chart.component';



@NgModule({
  declarations: [GanttChartComponent],
  imports: [
    CommonModule
  ],
  exports:[GanttChartComponent]
})
export class GanttChartModule { }
