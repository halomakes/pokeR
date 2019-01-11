import { Room } from './room';

export class User {
    public roomId: string;
    public displayName: string;
    public isHost: boolean;
    public room: Room;
}
