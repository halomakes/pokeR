import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngameComponent } from './pages/ingame/ingame.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'room/:id',
    component: IngameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
