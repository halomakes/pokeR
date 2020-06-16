import { Injectable } from '@angular/core';
import { ThemeMode } from '../models/theme-mode';

const themes = {
  dark: {
    '--primary-color': '#353749',
    '--accent-color': '#53577D',
    '--contrast-color': 'white',
    '--hover-color': 'rgba(255,255,255,0.1)',
    '--active-color': 'rgba(255,255,255,0.2)',
    '--font-family': '\'Open Sans\',sans-serif',
    '--valid-color': 'green',
    '--invalid-color': '#ff5c5c'
  }, light: {
    '--primary-color': '#E9E9E9',
    '--accent-color': '#9FA2C2',
    '--contrast-color': '#353749',
    '--hover-color': 'rgba(0,0,0,0.1)',
    '--active-color': 'rgba(0,0,0,0.2)',
    '--font-family': '\'Open Sans\',sans-serif',
    '--valid-color': 'green',
    '--invalid-color': 'red'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  public applyTheme = (m: ThemeMode): void => {
    switch (m) {
      case ThemeMode.automatic:
        if (this.isInDarkMode()) {
          this.setVariables(themes.dark);
        } else {
          this.setVariables(themes.light);
        } return;
      case ThemeMode.dark:
        this.setVariables(themes.dark);
        return;
      case ThemeMode.light:
        this.setVariables(themes.light);
        return;
    }
  }

  private isInDarkMode = (): boolean => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  private setVariables = (map: any) => Object.keys(map)
    .forEach(k => document.documentElement.style.setProperty(k, map[k]))
}
