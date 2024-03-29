import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaneDrawerComponent } from './pane-drawer.component';

describe('PaneDrawerComponent', () => {
  let component: PaneDrawerComponent;
  let fixture: ComponentFixture<PaneDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaneDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaneDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
