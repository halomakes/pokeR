import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, debounceTime, flatMap, filter } from 'rxjs/operators';
import { User } from 'src/app/models/entities/user';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-host-controls',
  templateUrl: './host-controls.component.html',
  styleUrls: ['./host-controls.component.scss']
})
export class HostControlsComponent implements OnInit {
  private _currentTagline: string;
  private latestTaglineInput: string;
  countdownIsActive = false;
  remainingTime: number;
  maxTime: number;
  deadline: Date;
  timer: number;
  player: User;
  formGroup: FormGroup = new FormGroup({
    subject: new FormControl(''),
    countdown: new FormControl('')
  });

  get currentTagLine() {
    return this._currentTagline;
  }

  set currentTagline(value: string) {
    this._currentTagline = value;
    this.formGroup.get('subject').setValue(value);
  }

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
      this.watchHostChanges()
    )

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
    const countdownLength = Number(this.formGroup.get('countdown').value);
    if (countdownLength) {
      this.service.startTimer(1000 * countdownLength).subscribe();
      this.countdownIsActive = true;
      window.setTimeout(() => {
        this.service.endRound().subscribe();
      }, 1000 * countdownLength);
    }
  }

  startNewRound = (): Subscription => this.service.startRound().subscribe();

  watchInputChange = (): Observable<any> => {
    const control = this.formGroup.get('subject');
    const source = control.valueChanges.pipe(filter(v => v !== this.latestTaglineInput));
    return forkJoin(
      source.pipe(debounceTime(2000), flatMap(this.service.storeTagline)),
      source.pipe(debounceTime(300), flatMap(this.service.updateTagline)),
      source.pipe(map(v => this.latestTaglineInput = v))
    );
  };

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
      this.formGroup.get('countdown').setValue('');
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

  watchHostChanges = (): Observable<void> =>
    this.service.hostChanges.pipe(map(d => {
      const playerMatch = d.collection.find(c => c.id === this.player.id);
      if (playerMatch) {
        this.player = playerMatch;
      }
    }))
}
