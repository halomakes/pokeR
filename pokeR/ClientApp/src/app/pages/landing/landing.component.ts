import { Component } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  public exiting = false;

  constructor(
    private router: Router
  ) { }

  onExit = (route: any[]): Subscription => of(null).pipe(
    tap(() => this.exiting = true),
    delay(550),
    tap(() => this.router.navigate(route))
  ).subscribe()
}
