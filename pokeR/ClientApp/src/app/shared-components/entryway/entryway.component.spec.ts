import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntrywayComponent } from './entryway.component';

describe('EntrywayComponent', () => {
  let component: EntrywayComponent;
  let fixture: ComponentFixture<EntrywayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrywayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrywayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
