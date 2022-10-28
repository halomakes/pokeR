import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HostControlsComponent } from './host-controls.component';

describe('HostControlsComponent', () => {
  let component: HostControlsComponent;
  let fixture: ComponentFixture<HostControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HostControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
