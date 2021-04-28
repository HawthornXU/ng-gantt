import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttScrollThumbComponent } from './gantt-scroll-thumb.component';

describe('GanttScrollThumbComponent', () => {
  let component: GanttScrollThumbComponent;
  let fixture: ComponentFixture<GanttScrollThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttScrollThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttScrollThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
