import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostControlsComponent } from './host-controls.component';

describe('HostControlsComponent', () => {
  let component: HostControlsComponent;
  let fixture: ComponentFixture<HostControlsComponent>;

  beforeEach(async(() => {
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
