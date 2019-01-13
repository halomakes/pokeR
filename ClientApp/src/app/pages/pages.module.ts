import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngameComponent } from './ingame/ingame.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  declarations: [IngameComponent],
  imports: [
    CommonModule,
    SharedComponentsModule
  ], exports: [
    IngameComponent
  ]
})
export class PagesModule { }
