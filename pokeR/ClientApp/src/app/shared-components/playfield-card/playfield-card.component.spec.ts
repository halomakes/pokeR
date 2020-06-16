import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayfieldCardComponent } from './playfield-card.component';

describe('PlayfieldCardComponent', () => {
  let component: PlayfieldCardComponent;
  let fixture: ComponentFixture<PlayfieldCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayfieldCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayfieldCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
