import { Component, OnInit } from '@angular/core';
import { CreateRoomRequest } from 'src/app/models/create-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Deck } from 'src/app/models/entities/deck';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  model: CreateRoomRequest = new CreateRoomRequest();
  decks: Array<Deck> = new Array<Deck>();

  constructor(private service: PokerService, private router: Router) { }

  ngOnInit() {
    this.service.getDecks().subscribe(d => this.decks = d);
  }

  // tslint:disable-next-line:triple-equals
  getSelectedDeck = (): Deck => this.decks.find(d => d.id == this.model.deckId);

  createRoom = () => {
    this.service.createRoom(this.model).pipe(map(r => {
      this.router.navigate(['/room', this.model.id]);
    })).subscribe();
  }
}
