import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, OnDestroy } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from 'src/app/models/entities/card';
import { ConfettiService } from '../confetti/confetti.service';
import { PlayfieldCardComponent } from '../playfield-card/playfield-card.component';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit, OnDestroy {
  @ViewChild('overlayCardHolder', { read: ViewContainerRef }) notificationHolder: ViewContainerRef;
  lastState: Array<User> = new Array<User>();
  isRevealed = false;
  cardComponents: Array<ComponentRef<PlayfieldCardComponent>> = [];

  constructor(
    private service: PokerService,
    private confetti: ConfettiService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.watchState().subscribe();
  }

  ngOnDestroy(): void {
    this.cardComponents.forEach(c => c.destroy());
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
      this.updateState(p.collection);
      this.animateCardPlay(p.delta.currentCard, p.delta.emblemId, p.delta.displayName);
    }))

  watchRoundEnd = (): Observable<void> =>
    this.service.roundEnds.pipe(map(() => {
      this.revealCards();
    }))

  watchRoundStart = (): Observable<void> =>
    this.service.roundStarts.pipe(map(() => {
      this.updateState(new Array<User>());
      this.isRevealed = false;
    }))

  watchParts = (): Observable<void> =>
    this.service.userLeaves.pipe(map(c => {
      this.updateState(this.lastState.filter(u => u.id !== c.delta.id));
    }))

  getActiveCards = (): Array<User> => this.lastState.filter((u: User) => u.currentCard !== null);

  animateCardPlay = (c: Card, emblemId: number, userName: string) => console.log(`showing card FACE DOWN!: `, c);

  revealCards = (): void => {
    this.isRevealed = true;
    console.log('YOU ACTIVATED MY TRAP CARD!');
    if (this.lastState.map(s => s.currentCardId).every(i => this.lastState.find(() => true).currentCardId === i)) {
      console.log('party time!');
      this.confetti.pop(true);
    }

    this.cardComponents.forEach((componentRef, index) => componentRef.instance.reveal(index * 70));
  }

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  private updateState = (newState: Array<User>): void => {
    const previousState = this.lastState;
    this.lastState = newState;

    // need to add cards from new set for users that hadn't played yet or card value has changed
    const cardsToAdd = newState
      .filter(n => n.currentCardId)
      .filter(n => !previousState.find(p => p.id === n.id && p.currentCardId === n.currentCardId));

    // need to remove cards for users who parted or card value has changed
    const cardsToRemove = previousState.filter(p => !newState.find(n => p.id === n.id && p.currentCardId === n.currentCardId));

    console.log('updating', cardsToAdd, cardsToRemove);
    cardsToRemove.forEach(this.removeCardComponent);
    cardsToAdd.forEach(this.createCardComponent);
  }

  private createCardComponent = (user: User) => {
    const factory: ComponentFactory<PlayfieldCardComponent> = this.resolver.resolveComponentFactory(PlayfieldCardComponent);
    const container = this.notificationHolder;
    const component = container.createComponent(factory);
    component.instance.user = user;
    component.instance.isRevealed = this.isRevealed;
    component.instance.selfRef = component;
    this.cardComponents.push(component);
  }

  private removeCardComponent = (user: User): void => {
    const components = this.cardComponents.filter(r => r.instance.user.id === user.id);
    components.forEach(c => c.instance.withdraw());
    this.cardComponents = this.cardComponents.filter(c => !components.includes(c));
  }
}
