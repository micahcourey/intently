import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalTrackerComponent } from './goal-tracker.component';

describe('GoalTrackerComponent', () => {
  let component: GoalTrackerComponent;
  let fixture: ComponentFixture<GoalTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
