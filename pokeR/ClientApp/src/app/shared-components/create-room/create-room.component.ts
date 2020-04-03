import { Component, OnInit } from '@angular/core';
import { CreateRoomRequest } from 'src/app/models/create-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Deck } from 'src/app/models/entities/deck';
import { map, debounceTime, flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  decks: Array<Deck> = new Array<Deck>();
  isAvailable: boolean;

  submitAttempted = false;

  form: FormGroup = new FormGroup({
    roomId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    tagline: new FormControl(''),
    deck: new FormControl('', Validators.required)
  });

  constructor(private service: PokerService, private router: Router) { }

  ngOnInit() {
    this.service.getDecks().subscribe(d => this.decks = d);
    this.watchIdChanges().subscribe();
  }

  // tslint:disable-next-line:triple-equals
  getSelectedDeck = (): Deck => this.decks.find(d => d.id == this.form.get('deck').value);

  createRoom = () => {
    this.submitAttempted = true;
    if (this.form.valid && this.isAvailable) {
      const snapshot = this.getModel();
      this.service.createRoom(snapshot).pipe(map(() => {
        this.router.navigate(['/room', snapshot.id]);
      })).subscribe();
    }
  }

  getModel = (): CreateRoomRequest => <CreateRoomRequest>{
    id: this.form.get('roomId').value,
    name: this.form.get('name').value,
    tagLine: this.form.get('tagline').value,
    deckId: this.form.get('deck').value
  }

  watchIdChanges = (): Observable<any> => this.form.get('roomId').valueChanges.pipe(
    debounceTime(300),
    flatMap(this.service.checkAvailability),
    map(r => this.isAvailable = r)
  )

  getDelayStyle = (i: number) => <any>{
    'animation-delay': `${i * 60}ms`
  }
}
