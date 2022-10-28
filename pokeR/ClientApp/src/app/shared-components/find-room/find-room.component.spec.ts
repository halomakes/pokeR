import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindRoomComponent } from './find-room.component';

describe('FindRoomComponent', () => {
  let component: FindRoomComponent;
  let fixture: ComponentFixture<FindRoomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
