import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngameComponent } from './ingame/ingame.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [IngameComponent, LandingComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule
  ], exports: [
    IngameComponent
  ]
})
export class PagesModule { }
