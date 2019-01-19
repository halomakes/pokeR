import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from 'src/app/models/entities/card';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit {
  lastState: Array<User> = new Array<User>();

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.watchState().subscribe();
  }

  watchState = (): Observable<void> =>
    forkJoin(
      this.watchPlays(),
      this.watchRoundEnd()
    ).pipe(map(() => { }))

  watchPlays = (): Observable<void> =>
    this.service.cardPlays.pipe(map(p => {
      this.lastState = p.collection;
      this.animateCardPlay(p.delta.currentCard, p.delta.emblemId, p.delta.displayName);
    }))

  watchRoundEnd = (): Observable<void> =>
    this.service.roundEnds.pipe(map(p => {
      this.revealCards();
    }))

  animateCardPlay = (c: Card, emblemId: number, userName: string) => console.log(`showing card FACE DOWN!: `, c);

  revealCards = (): void => console.log('YOU ACTIVATED MY TRAP CARD!');

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);
}
