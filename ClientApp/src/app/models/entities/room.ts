import { Deck } from './deck';
import { User } from './user';

export class Room {
    public id: string;
    public name: string;
    public tagLine: string;
    public timeCreated: Date;
    public deckId: number;
    public deck: Deck;
    public users: Array<User>;
}
