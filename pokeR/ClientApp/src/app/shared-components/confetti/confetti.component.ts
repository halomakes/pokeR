import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ConfettiService } from './confetti.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare const confetti;

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  private confettiLauncher: any;

  constructor(private service: ConfettiService) { }

  ngAfterViewInit(): void {
    this.setupConfetti();
    this.watchRequests().subscribe();
  }

  setupConfetti = (): void => {
    this.confettiLauncher = confetti.create(this.canvas.nativeElement, { resize: true });
    this.confettiLauncher({
      particleCount: 100,
      spread: 160
    });
  }

  watchRequests = (): Observable<void> => this.service.confettiPlz.pipe(map(this.launch))

  launch = (duration: number): void => {
    var end = Date.now() + (duration);

    var interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          // since they fall down, start a bit higher than random
          y: Math.random() - 0.2
        }
      });
    }, 200);
  }

}
