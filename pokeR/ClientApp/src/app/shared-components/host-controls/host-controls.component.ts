import { Component, OnInit, EventEmitter } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { User } from 'src/app/models/entities/user';

@Component({
  selector: 'app-host-controls',
  templateUrl: './host-controls.component.html',
  styleUrls: ['./host-controls.component.scss']
})
export class HostControlsComponent implements OnInit {
  currentTagline: string;
  countdownInput: number;
  countdownIsActive = false;
  remainingTime: number;
  maxTime: number;
  deadline: Date;
  timer: number;
  player: User;
  private textChanges: EventEmitter<string> = new EventEmitter<string>();

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.player = this.service.player;
    this.initialize().subscribe();
    this.monitorGameState().subscribe();
  }

  initialize = (): Observable<any> => this.service.getTagline().pipe(map(t => this.currentTagline = t));

  monitorGameState = (): Observable<any> =>
    forkJoin(
      this.watchInputChange(),
      this.watchTaglineChanges(),
      this.watchRoundEnd(),
      this.watchCountdownStart(),
    )

  onTextChange = (newText: string): void => {
    this.textChanges.emit(newText);
    this.service.updateTagline(newText).subscribe();
  }

  getRemainingTime = (): number => this.deadline ? this.deadline.getTime() - Date.now() : 0;

  updateRemainingTime = (): void => {
    const time = this.getRemainingTime();
    if (time > 0) {
      this.remainingTime = time;
      this.timer = window.requestAnimationFrame(this.updateRemainingTime);
    } else {
      window.cancelAnimationFrame(this.timer);
    }
  }

  getCountdownValue = (): number => {
    const time = this.remainingTime;
    if (time > 0 && this.maxTime) {
      return time * 100 / this.maxTime;
    }
    return 0;
  }

  getTimeText = (): string => {
    let result = '';
    const value = this.remainingTime / 1000;
    if (value >= 60) {
      result += `${Math.floor(value / 60)}m `;
    }
    result += `${Math.floor(value % 60)}s`;
    return result;
  }

  startCountdown = (): void => {
    if (this.countdownInput !== 0) {
      this.service.startTimer(1000 * this.countdownInput).subscribe();
      this.countdownIsActive = true;
      window.setTimeout(() => {
        this.service.endRound().subscribe();
      }, 1000 * this.countdownInput);
    }
  }

  startNewRound = (): Subscription => this.service.startRound().subscribe();

  watchInputChange = (): Observable<Subscription> => this.textChanges
    .pipe(debounceTime(500))
    .pipe(map(t => this.service.storeTagline(t).subscribe()))

  watchTaglineChanges = (): Observable<void> =>
    this.service.taglineUpdated.pipe(map(t => {
      if (!this.player.isHost) {
        this.currentTagline = t;
      }
    }))

  watchRoundEnd = (): Observable<void> =>
    this.service.roundEnds.pipe(map(() => {
      this.countdownIsActive = false;
      this.remainingTime = null;
      this.maxTime = null;
      this.countdownInput = null;
      window.cancelAnimationFrame(this.timer);
    }))

  watchCountdownStart = (): Observable<void> =>
    this.service.timerStarts.pipe(map(t => {
      if (t) {
        this.maxTime = t;
        this.remainingTime = t;
        this.deadline = new Date(Date.now() + t);
        this.countdownIsActive = true;
        this.timer = window.requestAnimationFrame(this.updateRemainingTime);
      }
    }))
}
