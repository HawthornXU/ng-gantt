import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart/gantt-chart.define';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import TaskType = GanttChartConfig.TaskType;
import { GanttService } from 'component/gantt-chart/gantt.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInDays, isSameDay, addDays, getDate, getDay, format } from 'date-fns';
import { init, ZRenderType, Group } from 'zrender'
import TASK_ROW_HEIGHT = GanttChartConfig.TASK_ROW_HEIGHT;

@Component({
  selector: 'ng-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttChartComponent implements OnInit {
  @ViewChild('ganttCanvasContainer', {static: false}) ganttCanvasContainer: ElementRef;
  @ViewChild('Xscroll', {static: false}) xScroll: ElementRef;
  @ViewChild('Yscroll', {static: false}) yScroll: ElementRef;
  @ViewChild('milestone', {static: false}) milestone: TemplateRef<any>;

  @Input() scaleUnit: GanttChartConfig.GanttScaleUnit = GanttChartConfig.GanttScaleUnit.day;
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

  get scrollWidth() {
    return this.currentWidth / this.ganttWidth * this.currentWidth
  }

  get scrollHeight() {
    return this.currentHeight / this.ganttHeight * this.currentHeight
  };

  private leftOffset = 0;
  private isAfterViewInited = false;

  get currentWidth(): number {
    return this.el.nativeElement.clientWidth
  }

  get currentHeight(): number {
    return this.el.nativeElement.clientHeight
  }

  get ganttWidth(): number {
    return this.ganttService.getScaleUnitPixel(this.scaleUnit) * differenceInDays(this.endDate, this.beginDate) + 20;
  }

  get ganttHeight(): number {
    return  this.taskList.length * TASK_ROW_HEIGHT*window.devicePixelRatio + 100 ;
  }

  constructor(private ganttService: GanttService,
              private el: ElementRef) {
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
  }

  ngAfterViewChecked(): void {
  }

  private initToy() {
    this.initGantt();
    this.generateScaleData(this.beginDate, this.endDate);
    this.yScrollGroup = new Group({name: 'yScrollGroup'});
    this.generateTask()
    this.xScrollGroup.add(this.yScrollGroup)
    this.render.add(this.xScrollGroup);
    this.generateScoroll()
  }

  private addEventListenerByWindowResize() {
    fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(e => {
      this.initContainer();
      this.render.resize({width: this.currentWidth, height: this.currentHeight})
      this.render.refresh()
    })
  }

  onYScroll(y:number){
    this.yScrollGroup.attr({y: -y ?? 0})
  }

  onXScroll(x:number){
    this.xScrollGroup.attr({x: -x ?? 0})
  }

  private initGantt() {
    const container = this.initContainer();
    this.initZCanvas(container);

  }

  private initContainer(width = this.currentWidth, height = this.currentHeight): HTMLElement {
    const container = this.ganttCanvasContainer.nativeElement;
    container.style.width = width + 'px'
    container.style.height = height + 'px'
    return container
  }

  private initZCanvas(container: HTMLElement, width = this.currentWidth, height = this.currentHeight) {
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

  private generateScoroll() {
    // console.log(this.currentHeight)
    // console.log(this.ganttHeight)
    // this.scrollHeight =
    // this.scrollWidth =
    // console.log(this.scrollWidth);
    // this.ganttService.drawXScroll(this.ganttWidth,this.currentWidth)
    // const xEl = this.xScroll.nativeElement.children[0];
    // xEl.style.width = this.ganttWidth + 'px';
    // const yEl = this.yScroll.nativeElement.children[0];
    // yEl.style.height = this.ganttHeight + 'px';
  }

  private generateTask() {
    const taskList = this.taskList;

    for (let taskIndex = 0; taskIndex < taskList.length; taskIndex++) {
      let item = taskList[taskIndex]
      const y = 35.5 + (taskIndex * GanttChartConfig.TASK_ROW_HEIGHT);
      const x = differenceInDays(item.startDate, this.beginDate) * this.ganttService.getScaleUnitPixel(this.scaleUnit);
      const width = (differenceInDays(item.endDate, item.startDate) + 1) * this.ganttService.getScaleUnitPixel(this.scaleUnit);
      this.yScrollGroup.add(this.ganttService.drawTask(item.type, x, y, width, this.ganttWidth, item?.color));
    }
  }
}


