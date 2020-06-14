import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/entities/room';
import { Observable } from 'rxjs';
import { PokerService } from 'src/app/services/poker.service';
import { map, flatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.scss']
})
export class IngameComponent implements OnInit {
  isInGame = false;
  roomId: string;
  room: Room = new Room();

  isInvalid = false;

  constructor(private route: ActivatedRoute, private service: PokerService) { }

  ngOnInit() {
    this.loadRoom().subscribe();
  }

  onRoomError = (): boolean => this.isInvalid = true;

  onJoined = (): boolean => this.isInGame = true;

  loadRoom = (): Observable<Room> => this.route.params.pipe(
    map(params => params['id']),
    tap(id => this.roomId = id),
    flatMap(id => this.service.getRoom(id)),
    map(room => this.room = room)
  )

  reload = () => {
    this.service.getRoom(this.roomId).pipe(map(room => this.room = room)).subscribe();
    this.isInvalid = false;
  }
}
