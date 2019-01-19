import { Component, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { Card } from 'src/app/models/entities/card';
import { PokerService } from 'src/app/services/poker.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnChanges {
  @Input() cards: Array<Card>;
  @Input() isEnabled: boolean;
  @Output() cardSelected: EventEmitter<number> = new EventEmitter<number>();
  selectedCardId: number = null;

  constructor(private service: PokerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isEnabled && changes.isEnabled.currentValue !== changes.isEnabled.previousValue) {
      this.selectedCardId = null;
    }
  }

  onCardSelected = (cardId: number): void => {
    this.service.playCard(cardId);
    this.selectedCardId = cardId;
  }
}
