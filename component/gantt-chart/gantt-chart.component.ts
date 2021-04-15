import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart/gantt-chart.define';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import { GanttService } from 'component/gantt-chart/gantt.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInDays, isSameDay, addDays, getDate, getDay, format } from 'date-fns';
import { init, ZRenderType } from 'zrender'

@Component({
  selector: 'ng-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttChartComponent implements OnInit {
  @ViewChild('ganttCanvasContainer', {static: false}) ganttCanvasContainer: ElementRef;
  render: ZRenderType = null
  @ViewChild('Xscroll', {static: false}) xScroll: ElementRef;

  @Input() scaleUnit: GanttChartConfig.GanttScaleUnit = GanttChartConfig.GanttScaleUnit.day;
  @Input() beginMoment = new Date('2021-01-01');
  @Input() endMoment = new Date('2021-12-31');
  leftOffset = 0;
  isAfterViewInited = false;

  get currentWidth(): number {
    return this.el.nativeElement.clientWidth - 18
  }

  get currentHeight(): number {
    return this.el.nativeElement.clientHeight - 18
  }

  get ganttWidth(): number {
    return this.ganttService.getScaleUnitPixel(this.scaleUnit) * differenceInDays(this.endMoment, this.beginMoment) + 20;
  }

  constructor(private ganttService: GanttService,
              private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.scaleUnit && this.isAfterViewInited) {
      this.generateXscoroll()
      this.initGantt();
      this.generateScaleData(this.beginMoment, this.endMoment);
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.isAfterViewInited = true;
    this.initToy()
    this.addEventListenerByWindowResize()
    this.addEventListenerByXScrollElChange()
  }

  ngAfterViewChecked(): void {
  }

  private initToy() {
    this.generateXscoroll()
    this.initGantt();
    this.generateScaleData(this.beginMoment, this.endMoment);
  }

  private addEventListenerByWindowResize() {
    fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(e => {
      this.initContainer();
      this.render.resize({width: this.currentWidth, height: this.currentHeight})
      this.render.refresh()
    })
  }

  private addEventListenerByXScrollElChange() {
    const xScrollEl = this.xScroll.nativeElement
    fromEvent(xScrollEl, 'scroll').pipe().subscribe((e: Event) => {
      this.leftOffset = (e.target as Element).scrollLeft ?? 0;
      this.render.clear()
      this.generateScaleData(this.beginMoment, this.endMoment);

    })
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
    const render: ZRenderType = this.render
    this.ganttService.drawDateScaleBottomBorder(render,this.ganttWidth)
    if (beginMoment && endMoment) {
      let handleDate = beginMoment
      for (let index = 0; !isSameDay(handleDate, endMoment); index++) {
        const offset = index * this.ganttService.getScaleUnitPixel(this.scaleUnit) - this.leftOffset;
        this.generateDate(render, handleDate, offset);
        handleDate = addDays(handleDate, 1,);
      }
    }
  }



  private generateDate(zCanvas: ZRenderType, handleDate: Date, offset: number) {
    this.generateDayScale(zCanvas, offset, handleDate)

    if (getDate(handleDate) == 1) {
      this.generateMonth(zCanvas, handleDate, offset)
    }
    if (getDay(handleDate) == 0 || getDay(handleDate) == 6) {
      this.generateWeekend(zCanvas, offset)
    }
  }

  private generateDayScale(zCanvas: ZRenderType, offset: number, handleDate: Date) {
    const dayString = getDate(handleDate)
    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      this.ganttService.drawDateScaleLeftBorder(zCanvas, offset);
    }

    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      this.ganttService.drawDayText(zCanvas, offset, dayString,this.scaleUnit)
    }

  }



  private generateMonth(zCanvas: ZRenderType, handleDate: Date, offset: number) {
    const monthString = format(handleDate, 'yyyy-MM');
    this.ganttService.drawMonthText(zCanvas, offset, monthString);
    this.ganttService.drawMonthScaleLine(zCanvas, offset)
  }

  private generateWeekend(zCanvas: ZRenderType, offset: number) {
      this.ganttService.drawNonworkdayBackground(zCanvas,offset,this.scaleUnit)
  }

  private generateXscoroll() {
    const xEl = this.xScroll.nativeElement.children[0];
    xEl.style.width = this.ganttWidth + 'px';
  }

}


