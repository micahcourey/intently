import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEditorComponent } from './activity-editor.component';

describe('ActivityEditorComponent', () => {
  let component: ActivityEditorComponent;
  let fixture: ComponentFixture<ActivityEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
