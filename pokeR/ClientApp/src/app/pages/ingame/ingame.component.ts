import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/entities/room';
import { Observable } from 'rxjs';
import { PokerService } from 'src/app/services/poker.service';
import { map, flatMap } from 'rxjs/operators';

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
    this.route.params.subscribe(p => {
      this.roomId = p['id'];
    });
  }

  onRoomError = (): boolean => this.isInvalid = true;

  onJoined = (): boolean => this.isInGame = true;

  loadRoom = (): Observable<Room> => this.route.params
    .pipe(flatMap(p => this.service.getRoom(p['id'])))
    .pipe(map(r => this.room = r))
}
