import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateRoomRequest } from '../models/create-room-request';
import { Deck } from '../models/entities/deck';
import { of, Observable, from, Subject, forkJoin } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { Room } from '../models/entities/room';
import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from '@aspnet/signalr';
import { JoinRoomRequest } from '../models/join-room-request';
import { User } from '../models/entities/user';
import { ListChange } from '../models/list-change';

@Injectable({
  providedIn: 'root'
})
export class PokerService {
  hub: HubConnection;

  private decks: Deck[];
  private room: Room;
  private users: User[];

  private isHubReady = false;

  public userJoins: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public userLeaves: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();

  constructor(private http: HttpClient) {
    this.initializeHubWatches().subscribe();
  }

  public reset = (): void => this.room = null;

  public createRoom = (request: CreateRoomRequest): Observable<void> =>
    this.http.post<void>('api/rooms', request)

  public getDecks = (): Observable<Deck[]> =>
    this.decks.length ? of(this.decks) :
      this.http.get<Deck[]>('api/decks').pipe(map(d => this.decks = d))

  public getRoom = (roomId: string): Observable<Room> =>
    this.room ? of(this.room) :
      this.http.get<Room>(`api/rooms/${roomId}`).pipe(map(r => this.room = r))

  public joinRoom = (request: JoinRoomRequest): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('joinRoom', request))))


  // subscribe to hub
  private getHub = (): Observable<HubConnection> =>
    this.isHubReady ? of(this.hub) : from(this.prepareHub())

  private prepareHub = (): Promise<HubConnection> => {
    this.hub = new HubConnectionBuilder()
      .withUrl('/notify/room')
      .withHubProtocol(new JsonHubProtocol())
      .build();
    return this.hub.start().catch(console.error).then(() => {
      this.isHubReady = true;
      return this.hub;
    });
  }

  private initializeHubWatches = (): Observable<void> => forkJoin(
    this.watchUsersJoin(),
    this.watchusersLeave()
  ).pipe(map(() => { }))

  private watchUsersJoin = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('UserJoined', (d: ListChange<User>) => {
      this.users = d.collection;
      this.userJoins.emit(d);
    })))

  private watchusersLeave = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('UserLeft', (d: ListChange<User>) => {
      this.users = d.collection;
      this.userLeaves.emit(d);
    })))
}
