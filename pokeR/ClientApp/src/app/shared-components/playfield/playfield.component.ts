import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from 'src/app/models/entities/card';
import { ConfettiService } from '../confetti/confetti.service';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit {
  lastState: Array<User> = new Array<User>();
  isRevealed = false;

  constructor(private service: PokerService, private confetti: ConfettiService) { }

  ngOnInit() {
    this.watchState().subscribe();
  }

  watchState = (): Observable<void> =>
    forkJoin(
      this.watchPlays(),
      this.watchRoundEnd(),
      this.watchParts(),
      this.watchRoundStart()
    ).pipe(map(() => { }))

  watchPlays = (): Observable<void> =>
    this.service.cardPlays.pipe(map(p => {
      this.lastState = p.collection;
      this.animateCardPlay(p.delta.currentCard, p.delta.emblemId, p.delta.displayName);
    }))

  watchRoundEnd = (): Observable<void> =>
    this.service.roundEnds.pipe(map(() => {
      this.revealCards();
    }))

  watchRoundStart = (): Observable<void> =>
    this.service.roundStarts.pipe(map(() => {
      this.lastState = new Array<User>();
      this.isRevealed = false;
    }))

  watchParts = (): Observable<void> =>
    this.service.userLeaves.pipe(map(c => {
      this.lastState = this.lastState.filter(u => u.id !== c.delta.id);
    }))

  getActiveCards = (): Array<User> => this.lastState.filter((u: User) => u.currentCard !== null);

  animateCardPlay = (c: Card, emblemId: number, userName: string) => console.log(`showing card FACE DOWN!: `, c);

  revealCards = (): void => {
    this.isRevealed = true;
    console.log('YOU ACTIVATED MY TRAP CARD!');
    if (this.lastState.map(s => s.currentCardId).every(i => this.lastState.find(() => true).currentCardId === i)) {
      console.log('party time!');
      this.showConfetti();
    }
  }

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  private showConfetti = (): void => this.confetti.pop();
}
