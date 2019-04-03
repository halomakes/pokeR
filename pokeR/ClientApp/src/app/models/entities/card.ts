import { Deck } from './deck';

export class Card {
    public id: number;
    public name: string;
    public order: number;
    public image: string;
    public deckId: number;
    public deck: Deck;
}
