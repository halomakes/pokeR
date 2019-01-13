import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.scss']
})
export class IngameComponent implements OnInit {
  isInGame = false;
  roomId: string;

  isInvalid = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.roomId = p['id'];
    });
  }

  onRoomError = (): boolean => this.isInvalid = true;

  onJoined = (): boolean => this.isInGame = true;
}
