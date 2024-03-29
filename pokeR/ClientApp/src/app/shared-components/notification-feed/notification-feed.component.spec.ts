import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationFeedComponent } from './notification-feed.component';

describe('NotificationFeedComponent', () => {
  let component: NotificationFeedComponent;
  let fixture: ComponentFixture<NotificationFeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
