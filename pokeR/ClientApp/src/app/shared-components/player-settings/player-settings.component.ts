import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';

@Component({
  selector: 'app-player-settings',
  templateUrl: './player-settings.component.html',
  styleUrls: ['./player-settings.component.scss']
})
export class PlayerSettingsComponent implements OnInit {
  roomId: string;
  get playerName(): string {
    return this.service.player.displayName;
  }

  constructor(private service: PokerService) {
    this.roomId = service.player.roomId;
  }

  ngOnInit() {
  }
}
