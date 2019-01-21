import { Component, OnInit, EventEmitter } from '@angular/core';
import { CreateRoomRequest } from 'src/app/models/create-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Deck } from 'src/app/models/entities/deck';
import { map, debounceTime, flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  model: CreateRoomRequest = new CreateRoomRequest();
  decks: Array<Deck> = new Array<Deck>();
  isAvailable: boolean;

  private idInputs: EventEmitter<string> = new EventEmitter<string>();

  constructor(private service: PokerService, private router: Router) { }

  ngOnInit() {
    this.service.getDecks().subscribe(d => this.decks = d);
    this.checkId().subscribe();
  }

  // tslint:disable-next-line:triple-equals
  getSelectedDeck = (): Deck => this.decks.find(d => d.id == this.model.deckId);

  createRoom = () => {
    this.service.createRoom(this.model).pipe(map(r => {
      this.router.navigate(['/room', this.model.id]);
    })).subscribe();
  }

  onInput = (currentId: string) => {
    this.isAvailable = null;
    if (currentId) {
      this.idInputs.emit(currentId);
    }
  }

  checkId = (): Observable<void> => this.idInputs
    .pipe(debounceTime(300))
    .pipe(flatMap(i => {
      console.log(i);
      return this.service.checkAvailability(i);
    }))
    .pipe(map(r => {
      this.isAvailable = r;
      console.log(r, typeof (r));
    }))
}
