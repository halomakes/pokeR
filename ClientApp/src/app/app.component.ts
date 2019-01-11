import { Component, OnInit } from '@angular/core';
import { PokerService } from './services/poker.service';
import { JoinRoomRequest } from './models/join-room-request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  constructor(private svc: PokerService) { }

  ngOnInit(): void {
    this.svc.userJoins.subscribe(r => console.log('join: ', r));
    this.svc.userLeaves.subscribe(r => console.log('leave: ', r));
    this.svc.joinRoom(<JoinRoomRequest>{
      roomId: '1234',
      name: 'potato',
      cardId: 1
    }).subscribe();
  }
}
