import { Card } from './card';

export class Deck {
    public id: number;
    public name: string;
    public description: string;
    public cards: Array<Card>;
}
