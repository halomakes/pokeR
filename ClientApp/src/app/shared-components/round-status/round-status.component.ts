import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-round-status',
  templateUrl: './round-status.component.html',
  styleUrls: ['./round-status.component.scss']
})
export class RoundStatusComponent implements OnInit {
  users: Array<User> = new Array<User>();

  constructor(private service: PokerService) { }

  ngOnInit() {
    console.log(this.service.player);
    this.initialize().subscribe();
    this.monitorGameState().subscribe();
  }

  initialize = (): Observable<Array<User>> =>
    this.service.getPlayers().pipe(map(p => this.users = p))

  monitorGameState = (): Observable<void> =>
    forkJoin(
      this.watchPlays(),
      this.watchParts(),
      this.watchRoundStart(),
      this.watchJoins()
    ).pipe(map(() => { }))

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
