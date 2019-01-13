import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/entities/card';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  @Input() cards: Array<Card>;
  @Input() isEnabled: boolean;
  @Output() cardSelected: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  onCardSelected = (cardId: number): void => this.cardSelected.emit(cardId);
}
