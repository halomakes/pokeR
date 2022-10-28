import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayfieldComponent } from './playfield.component';

describe('PlayfieldComponent', () => {
  let component: PlayfieldComponent;
  let fixture: ComponentFixture<PlayfieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
