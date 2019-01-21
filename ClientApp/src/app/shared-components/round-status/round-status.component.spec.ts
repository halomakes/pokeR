import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundStatusComponent } from './round-status.component';

describe('RoundStatusComponent', () => {
  let component: RoundStatusComponent;
  let fixture: ComponentFixture<RoundStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
