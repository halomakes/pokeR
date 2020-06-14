import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterComponent } from './roster.component';

describe('RoundStatusComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
