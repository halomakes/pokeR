import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Room } from 'src/app/models/entities/room';
import { PokerService } from 'src/app/services/poker.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnChanges {
  @Input()
  roomId: string;
  room: Room;

  @Output()
  roomError: EventEmitter<boolean> = new EventEmitter<boolean>();

  exists: boolean;

  constructor(private service: PokerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.roomId.currentValue) {
      this.roomId = changes.roomId.currentValue;
      this.loadRoom().subscribe(() => { }, (error) => {
        this.roomError.emit(true);
        this.exists = false;
      });
    }
  }

  loadRoom = (): Observable<void> => this.service.getRoom(this.roomId).pipe(map(r => {
    this.room = r;
    this.exists = true;
  }))
}
