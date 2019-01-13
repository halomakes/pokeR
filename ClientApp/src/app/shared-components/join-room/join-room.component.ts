import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JoinRoomRequest } from 'src/app/models/join-room-request';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnChanges {
  @Input()
  roomId: string;

  model: JoinRoomRequest = new JoinRoomRequest();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.roomId.currentValue) {
      this.model.roomId = changes.roomId.currentValue;
    }
  }
}
