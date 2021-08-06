import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateRoomRequest } from '../models/create-room-request';
import { Deck } from '../models/entities/deck';
import { of, Observable, from, forkJoin } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { Room } from '../models/entities/room';
import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from '@microsoft/signalr';
import { JoinRoomRequest } from '../models/join-room-request';
import { User } from '../models/entities/user';
import { ListChange } from '../models/list-change';
import { Emblem } from '../models/entities/emblem';
import { Card } from '../models/entities/card';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PokerService {
  hub: HubConnection;

  private decks: Deck[] = new Array<Deck>();
  private room: Room;
  private users: User[];
  private emblems: Emblem[] = new Array<Emblem>();
  private lastJoinRequest: JoinRoomRequest;

  private _isHubReady: boolean = false;
  private get isHubReady(): boolean {
    return this._isHubReady;
  }
  private set isHubReady(value: boolean) {
    this.connectionState.emit(value);
    this._isHubReady = value;
  }

  public userJoins: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public userLeaves: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public userUpdates: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public roomClosing: EventEmitter<void> = new EventEmitter<void>();
  public cardPlays: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public hostChanges: EventEmitter<ListChange<User>> = new EventEmitter<ListChange<User>>();
  public roundStarts: EventEmitter<void> = new EventEmitter<void>();
  public roundEnds: EventEmitter<void> = new EventEmitter<void>();
  public taglineUpdated: EventEmitter<string> = new EventEmitter<string>();
  public timerStarts: EventEmitter<number> = new EventEmitter<number>();
  public playerChanges: EventEmitter<User> = new EventEmitter<User>();
  public connectionState: EventEmitter<boolean> = new EventEmitter<boolean>();

  public player: User;

  constructor(private http: HttpClient, private notifications: NotificationService, private router: Router) {
    this.initializeHubWatches().subscribe();
  }

  public getEmblemUrl = (id: number): string => `/api/emblems/${id}/image`;

  public reset = (): void => this.room = null;

  public createRoom = (request: CreateRoomRequest): Observable<void> =>
    this.http.post<void>('/api/rooms', request);

  public getDecks = (): Observable<Deck[]> =>
    this.decks.length ? of(this.decks) :
      this.http.get<Deck[]>('/api/decks').pipe(map(d => this.decks = d));

  public getEmblems = (): Observable<Emblem[]> =>
    this.emblems.length ? of(this.emblems) :
      this.http.get<Emblem[]>('/api/emblems').pipe(map(e => this.emblems = e));

  public getRoom = (roomId: string): Observable<Room> =>
    this.http.get<Room>(`/api/rooms/${roomId}`).pipe(map(r => this.room = r));

  public getPlayers = (): Observable<Array<User>> => this.room
    ? this.http.get<Room>(`/api/rooms/${this.room.id}`).pipe(map(r => r.users))
    : of(new Array<User>());

  public getTagline = (): Observable<string> => this.room
    ? this.getRoom(this.room.id).pipe(map(r => r.tagLine))
    : of('');

  public joinRoom = (request: JoinRoomRequest): Observable<void> => {
    this.lastJoinRequest = request;
    return this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('joinRoom', request))));
  }

  public leaveRoom = (): Observable<void> => {
    this.lastJoinRequest = null;
    return this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('leaveRoom'))));
  }

  public updateUser = (updated: JoinRoomRequest): Observable<void> => {
    if (this.player) {
      this.player.displayName = updated.name;
      this.player.emblemId = updated.emblemId;
    }

    return this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('updateUser', updated))))
  };

  public playCard = (cardId: number): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('playCard', cardId))));

  public startRound = (): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('startRound'))));

  public updateTagline = (newTagline: string): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('updateTagline', newTagline))));

  public storeTagline = (newTagline: string): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('storeTagline', newTagline))));

  public startTimer = (milliseconds: number): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('startTimer', milliseconds))));

  public endRound = (): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('endRound'))));

  public changeHost = (newHostId: string): Observable<void> =>
    this.getHub().pipe(flatMap((hub: HubConnection) => from(hub.invoke('switchHost', newHostId))));

  public checkAvailability = (id: string): Observable<boolean> =>
    this.http.get(`/api/rooms/available/${id}`, { observe: 'response', responseType: 'text' as 'json' })
      .pipe(map(r => r.body === 'true'));

  public getCards = (deckId: number): Observable<Card[]> =>
    this.getDecks().pipe(map(ds => {
      const deck = ds.find(d => d.id === deckId);
      return deck.cards.sort(this.orderCards);
    }));

  private orderCards = (a: Card, b: Card): number => a.order - b.order;

  // subscribe to hub
  private getHub = (): Observable<HubConnection> =>
    this.isHubReady ? of(this.hub) : from(this.prepareHub());

  private prepareHub = async (): Promise<HubConnection> => {
    this.hub = new HubConnectionBuilder()
      .withUrl('/notify/room')
      .withAutomaticReconnect([0, 1000, 2000, 3000, 5000, 10000, 12000, 15000, 30000, null])
      .withHubProtocol(new JsonHubProtocol())
      .build();

    this.hub.onreconnecting(this.onDisconnect);
    this.hub.onreconnected(this.onReconnected);
    try {
      await this.hub.start();
      this.isHubReady = true;
    } catch (ex) {
      console.error('could not start hub', ex);
    }
    return this.hub;
  };

  private onDisconnect = (): void => {
    this.isHubReady = false;
    this.notifications.notify('Lost connection to server… attempting to reconnect.');
  }

  private onReconnected = (): void => {
    this.notifications.notify('Connection restored.  Getting you back in the game…');
    if (this.lastJoinRequest) {
      this.joinRoom(this.lastJoinRequest).subscribe(r => this.isHubReady = true);
    } else {
      this.isHubReady = true;
    }
  }

  private initializeHubWatches = (): Observable<void> => forkJoin(
    this.watchUsersJoin(),
    this.watchUsersLeave(),
    this.watchUsersUpdate(),
    this.watchRoomClose(),
    this.watchCardPlays(),
    this.watchRoundStarts(),
    this.watchRoundEnds(),
    this.watchTaglineUpdates(),
    this.watchTimerStarts(),
    this.watchSelfInfo(),
    this.watchMessages(),
    this.watchHostChanges()
  ).pipe(map(() => { }));

  private watchUsersJoin = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('UserJoined', (d: ListChange<User>) => {
      this.users = d.collection;
      this.userJoins.emit(d);
    })));

  private watchUsersLeave = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('UserLeft', (d: ListChange<User>) => {
      this.users = d.collection;
      this.userLeaves.emit(d);
    })));

  private watchUsersUpdate = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('UserUpdated', (d: ListChange<User>) => {
      this.users = d.collection;
      this.userUpdates.emit(d);
    })));

  private watchRoomClose = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoomClosed', () => {
      this.roomClosing.emit();
      this.router.navigate(['/']);
    })));

  private watchCardPlays = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('CardPlayed', (c: ListChange<User>) => {
      this.users = c.collection;
      this.cardPlays.emit(c);
    })));

  private watchRoundStarts = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoundStarted', () => this.roundStarts.emit())));

  private watchRoundEnds = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('RoundEnded', () => this.roundEnds.emit())));

  private watchTaglineUpdates = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('TaglineUpdated', (t: string) => {
      this.room.tagLine = t;
      this.taglineUpdated.emit(t);
    })));

  private watchTimerStarts = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('TimerStarted', (d: number) => this.timerStarts.emit(d))));

  private watchSelfInfo = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('Self', (u: User) => {
      this.player = u;
      this.playerChanges.emit(u);
    })));

  private watchMessages = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('Message', this.notifications.notify)));

  private watchHostChanges = (): Observable<void> =>
    this.getHub().pipe(map(h => h.on('HostChange', (d: ListChange<User>) => {
      this.users = d.collection;
      this.hostChanges.emit(d);
    })));
}
