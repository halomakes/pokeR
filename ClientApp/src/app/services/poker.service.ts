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
import { Emblem } from '../models/entities/emblem';
import { Card } from '../models/entities/card';

@Injectable({
  providedIn: 'root'
})
export class PokerService {
  hub: HubConnection;

  private decks: Deck[] = new Array<Deck>();
  private room: Room;
  private users: User[];
  private emblems: Emblem[] = new Array<Emblem>();

  private isHubReady = false;

  public userJoins: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public userLeaves: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public roomClosing: EventEmitter<void> = new EventEmitter<void>();
  public cardPlays: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public roundStarts: EventEmitter<void> = new EventEmitter<void>();
  public roundEnds: EventEmitter<void> = new EventEmitter<void>();
  public taglineUpdated: EventEmitter<string> = new EventEmitter<string>();
  public timerStarts: EventEmitter<number> = new EventEmitter<number>();

  public player: User;

  constructor(private http: HttpClient) {
    this.initializeHubWatches().subscribe();
  }

  public getEmblemUrl = (id: number): string => `api/emblems/${id}/image`;

  public reset = (): void => this.room = null;

  public createRoom = (request: CreateRoomRequest): Observable<void> =>
    this.http.post<void>('api/rooms', request)

  public getDecks = (): Observable<Deck[]> =>
    this.decks.length ? of(this.decks) :
      this.http.get<Deck[]>('api/decks').pipe(map(d => this.decks = d))

  public getEmblems = (): Observable<Emblem[]> =>
    this.emblems.length ? of(this.emblems) :
      this.http.get<Emblem[]>('api/emblems').pipe(map(e => this.emblems = e))

  public getRoom = (roomId: string): Observable<Room> =>
    this.http.get<Room>(`api/rooms/${roomId}`).pipe(map(r => this.room = r))

  public getPlayers = (): Observable<Array<User>> =>
    this.room
      ? this.http.get<Room>(`api/rooms/${this.room.id}`).pipe(map(r => r.users))
      : of(new Array<User>())

  public getTagline = (): Observable<string> =>
    this.room
      ? this.http.get<Room>(`api/rooms/${this.room.id}`).pipe(map(r => r.tagLine))
      : of('')

  public joinRoom = (request: JoinRoomRequest): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('joinRoom', request))))

  public leaveRoom = (): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('leaveRoom'))))

  public playCard = (cardId: number): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('playCard', cardId))))

  public startRound = (): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('startRound'))))

  public updateTagline = (newTagline: string): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('updateTagline', newTagline))))

  public storeTagline = (newTagline: string): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('storeTagline', newTagline))))

  public startTimer = (milliseconds: number): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('startTimer', milliseconds))))

  public getCards = (deckId: number): Observable<Card[]> =>
    this.getDecks().pipe(map(ds => {
      console.log(ds, deckId);
      const deck = ds.find(d => d.id === deckId);
      return deck.cards.sort(this.orderCards);
    }))

  private orderCards = (a: Card, b: Card): number => a.order - b.order;

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
    this.watchusersLeave(),
    this.watchRoomClose(),
    this.watchCardPlays(),
    this.watchRoundStarts(),
    this.watchRoundEnds(),
    this.watchTaglineUpdates(),
    this.watchTimerStarts(),
    this.watchSelfInfo()
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

  private watchRoomClose = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoomClosed', () => this.roomClosing.emit())))

  private watchCardPlays = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('CardPlayed', (c: ListChange<User>) => {
      this.users = c.collection;
      this.cardPlays.emit(c);
    })))

  private watchRoundStarts = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoundStarted', () => this.roundStarts.emit())))

  private watchRoundEnds = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoundEnded', () => this.roundEnds.emit())))

  private watchTaglineUpdates = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('TaglineUpdated', (t: string) => {
      this.room.tagLine = t;
      this.taglineUpdated.emit(t);
    })))

  private watchTimerStarts = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('TimerStarted', (d: number) => this.timerStarts.emit(d))))

  private watchSelfInfo = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('Self', (u: User) => this.player = u)))
}
