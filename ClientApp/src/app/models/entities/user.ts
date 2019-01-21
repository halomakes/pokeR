import { Room } from './room';
import { Emblem } from './emblem';
import { Card } from './card';

export class User {
    public id: string;
    public roomId: string;
    public displayName: string;
    public isHost: boolean;
    public emblemId: number;
    public currentCardId: number;
    public room: Room;
    public emblem: Emblem;
    public currentCard: Card;
}
