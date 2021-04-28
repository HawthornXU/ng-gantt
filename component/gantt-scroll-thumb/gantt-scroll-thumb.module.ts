import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { GanttScrollThumbComponent } from './gantt-scroll-thumb.component';



@NgModule({
  declarations: [GanttScrollThumbComponent],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports:[GanttScrollThumbComponent]

})
export class GanttScrollThumbModule { }
