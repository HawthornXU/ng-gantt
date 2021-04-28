import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, mapTo, pairwise, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'gantt-scroll-thumb',
  templateUrl: './gantt-scroll-thumb.component.html',
  styleUrls: ['./gantt-scroll-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttScrollThumbComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('xTrack') xTrack: ElementRef
  @ViewChild('yTrack') yTrack: ElementRef
  @ViewChild('xThumb') xThumb: ElementRef
  @ViewChild('yThumb') yThumb: ElementRef


  @Input() totalHeight: number;
  @Input() totalWidth: number
  @Input() viewHeight: number
  @Input() viewWidth: number

  @Input() set scrollTrack(v: { left: number, right: number, top: number, bottom: number, }) {
    this.xScrollTrackStyle = {
      left: v.left + 'px',
      right: v.right + 'px'
    };
    this.yScrollTrackStyle = {
      top: v.top + 'px',
      bottom: v.bottom + 'px',
    }
  }

  @Input() scrollTop: number = 0;
  @Output() scrollTopChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() scrollLeft: number = 0;
  @Output() scrollLeftChange: EventEmitter<number> = new EventEmitter<number>();

  xScrollTrackStyle = null
  yScrollTrackStyle = null

  xScrollStyle = {width: '0px'}
  yScrollStyle = {height: '0px'}

  yThumbMoveEvent = new Subject()
  xThumbMoveEvent = new Subject()

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges,): void {

  }

  onYThumbMove(e: any) {
    if (e.delta.y === null) {
      return
    }
    this.yThumbMoveEvent.next(this.yThumb.nativeElement.style.transform)
  }

  onXThumbMove(e: any) {
    if (e.delta.x === null) {
      return
    }
    this.xThumbMoveEvent.next(this.xThumb.nativeElement.style.transform)
  }

  ngAfterViewInit(): void {
    this.addEventListenerByWindowResize()
    this.addEventListenerByThumbMoveEvent()
  }

  private addEventListenerByWindowResize() {
    merge(of(0), fromEvent(window, 'resize')).pipe(debounceTime(80)).subscribe(res => {
      this.yScrollStyle.height = this.viewHeight / this.totalHeight * this.yTrack.nativeElement.clientHeight + 'px'
      this.xScrollStyle.width = this.viewWidth / this.totalWidth * this.xTrack.nativeElement.clientWidth + 'px'
      this.cd.detectChanges()
    })
  }

  private addEventListenerByThumbMoveEvent(){
    this.yThumbMoveEvent.pipe(
      throttleTime(8),
      pairwise(),
      filter(x=>x[0]!=x[1])
    ).subscribe(res=>{
      const offsetY = this.getOffsetYFromTransform(res[1]);
      this.scrollTopChange.emit(offsetY);
    })

    this.xThumbMoveEvent.pipe(
      throttleTime(8),
      pairwise(),
      filter(x=>x[0]!=x[1])
    ).subscribe(res=>{
      const offsetX = this.getOffsetXFromTransform(res[1]);
      this.scrollLeftChange.emit(offsetX);
    })
  }

  private getOffsetYFromTransform = (transformValue: unknown):number =>{
    if(typeof transformValue !== 'string'){
      return
    }
    const y = transformValue.split('px,')[1];
    return Number(y)/(this.viewHeight/this.totalHeight)
  }

  private getOffsetXFromTransform = (transformValue: unknown):number =>{
    if(typeof transformValue !== 'string'){
      return
    }
    const x = transformValue.split('(')[1].split('px')[0];
    return Number(x)/(this.viewWidth/this.totalWidth)
  }

}
