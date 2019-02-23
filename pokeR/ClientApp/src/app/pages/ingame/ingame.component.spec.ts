import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngameComponent } from './ingame.component';

describe('IngameComponent', () => {
  let component: IngameComponent;
  let fixture: ComponentFixture<IngameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
