import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Card } from 'src/app/models/entities/card';

@Component({
  selector: 'app-background-cards',
  templateUrl: './background-cards.component.html',
  styleUrls: ['./background-cards.component.scss']
})
export class BackgroundCardsComponent implements OnChanges {
  @Input() cards: Array<Card> = [];
  cardViews: any[] = [];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const newCards: Array<Card> = changes.cards.currentValue;
    this.cardViews = this.duplicate(newCards, 2).map(this.getView);
  }

  private getView = (c: Card): any => ({
    px: Math.random() * 100,
    py: Math.random() * 100,
    zBase: Math.random(),
    ox: Math.random() * 180 - 90,
    oy: Math.random() * 180 - 90,
    oz: Math.random() * 180 - 90,
    text: c.name
  })

  getStyle = (v: any): any => ({
    'transform': `translateZ(${v.zBase * 1200 - 600}px) rotateX(${v.ox}deg) rotateY(${v.oy}deg) rotateZ(${v.oz}deg)`,
    'left': `${v.px}%`,
    'top': `${v.py}%`,
    'opacity': v.zBase * 0.7 + 0.3
  })

  private duplicate = <TItem>(source: Array<TItem>, count: number): Array<TItem> => {
    let result = source;
    for (let i = 0; i < count; i++) {
      result = result.concat(result);
    }
    return result;
  }
}
