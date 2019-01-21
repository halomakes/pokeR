import { Component, OnInit, EventEmitter } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-round-status',
  templateUrl: './round-status.component.html',
  styleUrls: ['./round-status.component.scss']
})
export class RoundStatusComponent implements OnInit {
  users: Array<User> = new Array<User>();
  currentTagline: string;
  player: User;
  countdownInput: number;
  countdownIsActive = false;
  remainingTime: number;
  maxTime: number;
  private textChanges: EventEmitter<string> = new EventEmitter<string>();

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.player = this.service.player;
    this.initialize().subscribe();
    this.monitorGameState().subscribe();
  }

  getRemainingUsers = (): number => this.users.filter(u => u.currentCardId == null).length;

  initialize = (): Observable<void> =>
    forkJoin(
      this.service.getPlayers().pipe(map(p => this.users = p)),
      this.service.getTagline().pipe(map(t => this.currentTagline = t))
    ).pipe(map(() => { }))

  onTextChange = (newText: string): void => {
    this.textChanges.emit(newText);
    this.service.updateTagline(newText).subscribe();
  }

  getCountdownValue = (): number => this.remainingTime && this.maxTime ? this.remainingTime * 100 / this.maxTime : 0;

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
    }
  }

  startNewRound = (): Subscription => this.service.startRound().subscribe();

  monitorGameState = (): Observable<void> =>
    forkJoin(
      this.watchPlays(),
      this.watchParts(),
      this.watchRoundStart(),
      this.watchJoins(),
      this.watchInputChange(),
      this.watchTaglineChanges(),
      this.watchRoundEnd(),
      this.watchCountdownStart()
    ).pipe(map(() => { }))

  watchInputChange = (): Observable<Subscription> => this.textChanges
    .pipe(debounceTime(500))
    .pipe(map(t => this.service.storeTagline(t).subscribe()))

  watchTaglineChanges = (): Observable<void> =>
    this.service.taglineUpdated.pipe(map(t => {
      if (!this.player.isHost) {
        this.currentTagline = t;
      }
    }))

  watchParts = (): Observable<void> =>
    this.service.userLeaves.pipe(map(c => {
      this.users = c.collection;
    }))

  watchPlays = (): Observable<void> =>
    this.service.cardPlays.pipe(map(c => {
      this.users = c.collection;
    }))

  watchRoundStart = (): Observable<void> =>
    this.service.roundStarts.pipe(map(() => {
      this.users.forEach(u => {
        u.currentCard = null;
        u.currentCardId = null;
      });
    }))

  watchRoundEnd = (): Observable<void> =>
    this.service.roundEnds.pipe(map(() => {
      this.countdownIsActive = false;
      this.remainingTime = null;
      this.maxTime = null;
      this.countdownInput = null;
    }))

  watchJoins = (): Observable<void> =>
    this.service.userJoins.pipe(map(c => {
      this.users = c.collection;
    }))

  watchCountdownStart = (): Observable<void> =>
    this.service.timerStarts.pipe(map(t => {
      this.remainingTime = t;
      this.maxTime = t;
      this.countdownIsActive = true;
      setInterval(() => {
        this.remainingTime -= 1000;
      }, 1000);
    }))
}
