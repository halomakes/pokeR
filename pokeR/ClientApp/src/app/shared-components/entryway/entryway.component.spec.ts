import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrywayComponent } from './entryway.component';

describe('EntrywayComponent', () => {
  let component: EntrywayComponent;
  let fixture: ComponentFixture<EntrywayComponent>;

  beforeEach(async(() => {
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
