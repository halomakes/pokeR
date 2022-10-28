import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BackgroundCardsComponent } from './background-cards.component';

describe('BackgroundCardsComponent', () => {
  let component: BackgroundCardsComponent;
  let fixture: ComponentFixture<BackgroundCardsComponent>;

  beforeEach(waitForAsync(() => {
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
