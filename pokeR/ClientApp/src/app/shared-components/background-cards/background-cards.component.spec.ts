import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCardsComponent } from './background-cards.component';

describe('BackgroundCardsComponent', () => {
  let component: BackgroundCardsComponent;
  let fixture: ComponentFixture<BackgroundCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
