import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttDemoComponent } from './gantt-demo.component';

describe('GanttDemoComponent', () => {
  let component: GanttDemoComponent;
  let fixture: ComponentFixture<GanttDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
