import { Component, OnInit } from '@angular/core';
import { ThemeMode } from 'src/app/models/theme-mode';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  public currentTheme: ThemeMode = ThemeMode.automatic;
  public modes = ThemeMode;

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.applyTheme(this.currentTheme);
  }

  setTheme = (theme: ThemeMode): void => {
    this.currentTheme = theme;
    this.themeService.applyTheme(theme);
  }
}
