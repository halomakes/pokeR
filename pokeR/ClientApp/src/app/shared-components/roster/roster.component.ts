import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  users: Array<User> = new Array<User>();
  player: User;
  hoveredUser: User;

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.player = this.service.player;
    this.initialize().subscribe();
    this.monitorGameState().subscribe();
  }
  initialize = (): Observable<any> => this.service.getPlayers().pipe(map(p => this.users = p))

  monitorGameState = (): Observable<any> =>
    forkJoin(
      this.watchPlays(),
      this.watchParts(),
      this.watchRoundStart(),
      this.watchJoins(),
      this.watchUserUpdates(),
      this.watchPlayerChanges(),
      this.watchHostChanges()
    )

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

  watchUserUpdates = (): Observable<void> =>
    this.service.userUpdates.pipe(map(c => {
      this.users = c.collection;
    }))

  watchPlayerChanges = (): Observable<void> =>
    this.service.playerChanges.pipe(map(p => {
      this.player = p;
    }))

  watchHostChanges = (): Observable<void> =>
    this.service.hostChanges.pipe(map(d => {
      this.users = d.collection;
      const playerMatch = d.collection.find(c => c.id === this.player.id);
      if (playerMatch) {
        this.player = playerMatch;
      }
    }))

  allowDrop = ($event: any, u: User) => {
    $event.preventDefault();
    this.onDragEnter(u);
  }

  setKing = (id: string): void => {
    if (this.player.isHost && id !== this.getCurrentLeaderId()) {
      console.log('Kinging ' + id);
      this.service.changeHost(id).subscribe();
    }
  }

  private getCurrentLeaderId = (): string => {
    const leader = this.users.find(u => u.isHost);
    return leader ? leader.id : null;
  }

  onDragEnter = (u: User) => this.hoveredUser = u;

  onDragLeave = () => this.hoveredUser = null;
}
