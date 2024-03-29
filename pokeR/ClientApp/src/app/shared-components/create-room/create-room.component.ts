import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CreateRoomRequest } from 'src/app/models/create-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Deck } from 'src/app/models/entities/deck';
import { map, debounceTime, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  decks: Array<Deck> = new Array<Deck>();
  isAvailable: boolean;
  @Output() exit: EventEmitter<any[]> = new EventEmitter<any[]>();

  submitAttempted = false;

  form: UntypedFormGroup = new UntypedFormGroup({
    roomId: new UntypedFormControl('', Validators.required),
    name: new UntypedFormControl('', Validators.required),
    tagline: new UntypedFormControl(''),
    deck: new UntypedFormControl('', Validators.required)
  });

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.service.getDecks().subscribe(d => this.decks = d);
    this.watchIdChanges().subscribe();
  }

  join = (): void => this.exit.emit(['/room', this.form.get('roomId').value]);

  // tslint:disable-next-line:triple-equals
  getSelectedDeck = (): Deck => this.decks.find(d => d.id == this.form.get('deck').value);

  createRoom = () => {
    this.submitAttempted = true;
    if (this.form.valid && this.isAvailable) {
      const snapshot = this.getModel();
      this.service.createRoom(snapshot).pipe(map(() => {
        this.exit.emit(['/room', snapshot.id]);
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
