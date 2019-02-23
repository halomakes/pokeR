import { Card } from './card';
import { Room } from './room';

export class Deck {
    public id: number;
    public name: string;
    public description: string;
    public cards: Array<Card>;
    public rooms: Array<Room>;
}
