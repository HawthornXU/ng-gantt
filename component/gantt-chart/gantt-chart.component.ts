import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart/gantt-chart.define';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import TaskType = GanttChartConfig.TaskType;
import { GanttService } from 'component/gantt-chart/gantt.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInDays, isSameDay, addDays, getDate, getDay, format } from 'date-fns';
import { init, ZRenderType, Group, registerPainter } from 'zrender'
import TASK_ROW_HEIGHT = GanttChartConfig.TASK_ROW_HEIGHT;
import CanvasPainter from 'zrender/lib/canvas/Painter';
// @ts-ignore   fix error Renderer 'undefined' is not imported. Please import it first.
registerPainter('canvas', CanvasPainter)

@Component({
  selector: 'ng-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttChartComponent implements OnInit {
  @ViewChild('ganttCanvasContainer', {static: false}) ganttCanvasContainer: ElementRef;
  @ViewChild('Xscroll', {static: false}) xScroll: ElementRef;
  @ViewChild('Yscroll', {static: false}) yScroll: ElementRef;
  @ViewChild('milestone', {static: false}) milestone: TemplateRef<any>;

  @Input() set scaleUnit(value: GanttChartConfig.GanttScaleUnit){
    this.ganttService.scaleUnit = value;
  }

  get scaleUnit(): GanttChartConfig.GanttScaleUnit {
    return this.ganttService.scaleUnit;
  }

  @Input() beginDate = new Date('2021-01-01');
  @Input() endDate = new Date('2021-12-31');
  @Input() taskList: Array<TaskType> = [];

  private render: ZRenderType = null;
  /****
   * @description add all zElement be use to on Xscroll
   */
  private xScrollGroup: Group = null;
  private yScrollGroup: Group = null;
  scrollLeft = 0;
  scrollTop = 0;

  private leftOffset = 0;
  private isAfterViewInited = false;

  get viewWidth(): number {
    return this.el.nativeElement.clientWidth
  }

  get viewHeight(): number {
    return this.el.nativeElement.clientHeight
  }

  get ganttWidth(): number {
    return this.ganttService.getScaleUnitPixel(this.scaleUnit) * differenceInDays(this.endDate, this.beginDate) + 20;
  }

  get ganttHeight(): number {
    return this.taskList.length * TASK_ROW_HEIGHT  + 100;
  }

  constructor(private ganttService: GanttService,
              private el: ElementRef,
              private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.scaleUnit && this.isAfterViewInited) {
      this.initToy()
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.isAfterViewInited = true;
    this.initToy()
    this.addEventListenerByWindowResize();
    this.addEventListenerByMouseWheel()
  }

  ngAfterViewChecked(): void {
  }

  onYScroll(y: number) {
    this.scrollTop = y;
    if (this.yScrollGroup != null) {
      this.yScrollGroup.attr({y: -y ?? 0})
    }
  }

  onXScroll(x: number) {
    this.scrollLeft = x;
    if (this.xScrollGroup != null) {
      this.xScrollGroup.attr({x: -x ?? 0})
    }
  }

  private initToy() {
    this.initGantt();
    this.generateScaleData(this.beginDate, this.endDate);
    this.yScrollGroup = new Group({name: 'yScrollGroup'});
    this.generateTask()
    this.xScrollGroup.add(this.yScrollGroup)
    this.render.add(this.xScrollGroup);
  }

  private addEventListenerByWindowResize() {
    fromEvent(window, 'resize').pipe(debounceTime(100)).subscribe(e => {
      this.initContainer();
      this.render.resize({width: this.viewWidth, height: this.viewHeight})
      this.render.refresh()
    })
  }

  private addEventListenerByMouseWheel() {
    const canvasContainer = this.ganttCanvasContainer.nativeElement
    fromEvent(canvasContainer, 'wheel').subscribe(e => {
      if (this.viewHeight >= this.ganttHeight) {
        return
      }
      try {
        e['zrDelta'] > 0 ? this.scrollTop -= 25 : this.scrollTop += 25;
        // this.cd.markForCheck()
      } catch (e) {
        console.warn(e)
      }

    })
  }

  private initGantt() {
    const container = this.initContainer();
    this.initZCanvas(container);

  }

  private initContainer(width = this.viewWidth, height = this.viewHeight): HTMLElement {
    const container = this.ganttCanvasContainer.nativeElement;
    container.style.width = width + 'px'
    container.style.height = height + 'px'
    return container
  }

  private initZCanvas(container: HTMLElement, width = this.viewWidth, height = this.viewHeight) {
    this.render = init(container, {
      devicePixelRatio: window.devicePixelRatio,
      width,
      height
    })
  }


  private generateScaleData(beginMoment: Date, endMoment: Date) {
    const xScrollGroup = this.xScrollGroup = new Group({name: 'xScrollGroup'});
    xScrollGroup.add(this.ganttService.drawDateScaleBottomBorder(this.ganttWidth))
    if (beginMoment && endMoment) {
      let handleDate = beginMoment
      for (let index = 0; !isSameDay(handleDate, endMoment); index++) {
        const offset = index * this.ganttService.getScaleUnitPixel(this.scaleUnit) - this.leftOffset;
        this.generateDate(xScrollGroup, handleDate, offset);
        handleDate = addDays(handleDate, 1,);
      }
    }

  }


  private generateDate(xScrollGroup: Group, handleDate: Date, offset: number) {
    this.generateDayScale(xScrollGroup, offset, handleDate)

    if (getDate(handleDate) == 1) {
      this.generateMonth(xScrollGroup, handleDate, offset)
    }
    if (getDay(handleDate) == 0 || getDay(handleDate) == 6) {
      this.generateWeekend(xScrollGroup, offset)
    }
  }

  private generateDayScale(xScrollGroup: Group, offset: number, handleDate: Date) {
    const dayString = getDate(handleDate)
    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      xScrollGroup.add(this.ganttService.drawDateScaleLeftBorder(offset));
    }

    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      xScrollGroup.add(this.ganttService.drawDayText(offset, dayString, this.scaleUnit));
    }

  }


  private generateMonth(xScrollGroup: Group, handleDate: Date, offset: number) {
    const monthString = format(handleDate, 'yyyy-MM');
    xScrollGroup.add(this.ganttService.drawMonthText(offset, monthString));
    xScrollGroup.add(this.ganttService.drawMonthScaleLine(offset))
  }

  private generateWeekend(xScrollGroup: Group, offset: number) {
    xScrollGroup.add(this.ganttService.drawNonworkdayBackground(offset, this.scaleUnit))
  }

  private generateTask() {
    const taskList = this.taskList;
    for (let taskIndex = 0; taskIndex < taskList.length; taskIndex++) {
      let item = taskList[taskIndex]
      const y = 35.5 + (taskIndex * GanttChartConfig.TASK_ROW_HEIGHT);
      const x = differenceInDays(item.startDate, this.beginDate) * this.ganttService.getScaleUnitPixel(this.scaleUnit);
      this.yScrollGroup.add(this.ganttService.drawTask(item.type,x,  y,  this.ganttWidth,this.xScrollGroup,item));
    }
  }
}


