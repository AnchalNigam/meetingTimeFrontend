import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingManageComponent } from './meeting-manage.component';

describe('MeetingManageComponent', () => {
  let component: MeetingManageComponent;
  let fixture: ComponentFixture<MeetingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
