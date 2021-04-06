import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GanttChartConfig } from 'component/gantt-chart/gantt-chart.define';
import GanttScaleUnit = GanttChartConfig.GanttScaleUnit;
import { GanttService } from 'component/gantt-chart/gantt.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInDays, isSameDay, addDays, getDate, getDay, format } from 'date-fns';

@Component({
  selector: 'ng-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttChartComponent implements OnInit {
  @ViewChild('ganttCanvas', {static: false}) ganttCanvas: ElementRef;
  @ViewChild('Xscroll', {static: false}) xScroll: ElementRef;

  @Input() scaleUnit: GanttChartConfig.GanttScaleUnit = GanttChartConfig.GanttScaleUnit.day;
  @Input() beginMoment = new Date('2021-01-01');
  @Input() endMoment = new Date('2021-12-31');
  leftOffset = 0;

  constructor(private ganttService: GanttService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.scaleUnit) {
      this.generateXscoroll()
      this.refreshCanvas();
      this.generateScaleData(this.beginMoment, this.endMoment);
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.generateXscoroll()
    this.refreshCanvas();
    this.generateScaleData(this.beginMoment, this.endMoment);
    fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(e => {
      this.refreshCanvas();
      this.generateScaleData(this.beginMoment, this.endMoment);
    })
    const xScrollEl = this.xScroll.nativeElement
    fromEvent(xScrollEl, 'scroll').pipe().subscribe((e: Event) => {
      this.leftOffset = (e.target as Element).scrollLeft ?? 0;
      this.refreshCanvas();
      this.generateScaleData(this.beginMoment, this.endMoment);

    })

  }

  ngAfterViewChecked(): void {
  }

  private refreshCanvas() {
    const canvasEl = this.ganttCanvas.nativeElement
    const container = canvasEl.parentElement;
    // 减去滚动条需要占的宽度
    canvasEl.width = (container.clientWidth - 18) * window.devicePixelRatio;
    canvasEl.height = (container.clientHeight - 18) * window.devicePixelRatio;

    canvasEl.style.width = container.clientWidth - 18 + 'px'
    canvasEl.style.height = container.clientHeight - 18 + 'px'
  }

  private generateScaleData(beginMoment: Date, endMoment: Date) {
    const ctx = this.ganttCanvas.nativeElement.getContext('2d');
    // 高分屏适配
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    if (beginMoment && endMoment) {
      let handleDate = beginMoment
      for (let index = 0; !isSameDay(handleDate, endMoment); index++) {
        const offset = index * this.ganttService.getScaleUnitPixel(this.scaleUnit) - this.leftOffset;
        if (offset > this.ganttCanvas.nativeElement.width) {
          return
        }
        this.generateDate(ctx, handleDate, offset);
        handleDate = addDays(handleDate, 1,);
      }
    }
  }

  private generateDate(ctx: CanvasRenderingContext2D, handleDate: Date, offset: number) {

    this.generateDayScale(ctx, offset, handleDate)

    if (getDay(handleDate) == 0 || getDay(handleDate) == 6) {
      this.generateWeekend(ctx, offset)
    }
    if (getDate(handleDate) == 1) {
      this.generateMonth(ctx, handleDate, offset)
    }
  }

  private generateDayScale(ctx: CanvasRenderingContext2D, offset: number, handleDate: Date) {
    const dayString = getDate(handleDate)
    ctx.beginPath();
    ctx.strokeStyle = GanttChartConfig.ColorConfig.DateLineColor;
    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      // 画日期竖线
      ctx.moveTo(offset + 0.5, 18);
      ctx.lineTo(offset + 0.5, 35.5);
    }
    //画日期下面的横线
    ctx.moveTo(offset, 35.5)
    ctx.lineTo(offset + this.ganttService.getScaleUnitPixel(this.scaleUnit), 35.5)
    ctx.stroke();

    if (this.scaleUnit == GanttScaleUnit.day || getDay(handleDate) == 1) {
      //画日期
      ctx.beginPath();
      ctx.font = `12px Microsoft YaHei`;
      ctx.fillStyle = GanttChartConfig.ColorConfig.DateTextColor;
      let fontOffsetX = 1
      if (this.scaleUnit == GanttScaleUnit.day) {
        fontOffsetX = dayString.toString().length > 1 ? 14 : 18;
      }
      ctx.fillText(dayString.toString(), fontOffsetX + offset, 30)
    }
  }

  private generateMonth(ctx: CanvasRenderingContext2D, handleDate: Date, offset: number) {
    // const monthString = handleDate.format('YYYY-MM');
    const monthString = format(handleDate, 'yyyy-MM');
    ctx.beginPath();
    ctx.fillStyle = GanttChartConfig.ColorConfig.DateTextColor;
    ctx.font = `12px Microsoft YaHei`;
    ctx.fillText(monthString, ++offset, 12);
    ctx.beginPath();
    ctx.strokeStyle = GanttChartConfig.ColorConfig.MonthLineColor;
    ctx.moveTo(offset - 0.5, 35.5);
    ctx.lineTo(offset - 0.5, this.ganttCanvas.nativeElement.height);
    ctx.stroke();
  }

  private generateWeekend(ctx: CanvasRenderingContext2D, offset: number) {
    const scalePixel = this.ganttService.getScaleUnitPixel(this.scaleUnit)
    const yBegin = 35.5
    const yOffset = 6
    ctx.beginPath();
    ctx.strokeStyle = GanttChartConfig.ColorConfig.WeekendColor;
    for (let i = 6; scalePixel - i > 0; i += yOffset) {
      ctx.moveTo(offset + i, yBegin)
      ctx.lineTo(offset + scalePixel, yBegin - i + scalePixel)
    }
    for (let i = 0; i < this.ganttCanvas.nativeElement.height; i += yOffset) {
      ctx.moveTo(offset, yBegin + i)
      ctx.lineTo(offset + scalePixel, yBegin + scalePixel + i);
    }
    ctx.stroke();
  }

  private generateXscoroll() {
    const xEl = this.xScroll.nativeElement.children[0];
    const totalDay = differenceInDays(this.endMoment, this.beginMoment);
    xEl.style.width = this.ganttService.getScaleUnitPixel(this.scaleUnit) * totalDay + 20 + 'px';
  }

}


