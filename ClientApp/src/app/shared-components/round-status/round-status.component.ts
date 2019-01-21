import { Component, OnInit, EventEmitter } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin, Subscribable, Subscription } from 'rxjs';
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

  monitorGameState = (): Observable<void> =>
    forkJoin(
      this.watchPlays(),
      this.watchParts(),
      this.watchRoundStart(),
      this.watchJoins(),
      this.watchInputChange(),
      this.watchTaglineChanges()
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

  watchJoins = (): Observable<void> =>
    this.service.userJoins.pipe(map(c => {
      this.users = c.collection;
    }))
}
