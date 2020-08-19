import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSettingsComponent } from './player-settings.component';

describe('PlayerSettingsComponent', () => {
  let component: PlayerSettingsComponent;
  let fixture: ComponentFixture<PlayerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
