import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { JoinRoomRequest } from 'src/app/models/join-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Emblem } from 'src/app/models/entities/emblem';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnChanges, OnInit {
  @Input()
  roomId: string;

  @Output()
  joined: EventEmitter<boolean> = new EventEmitter<boolean>();

  emblems: Emblem[] = new Array<Emblem>();
  submitAttempted = false;

  form: FormGroup = new FormGroup({
    roomId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    emblemId: new FormControl('', Validators.required)
  });

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.loadEmblems().subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roomId.currentValue) {
      this.form.get('roomId').setValue(changes.roomId.currentValue);
    }
  }

  loadEmblems = (): Observable<Emblem[]> =>
    this.service.getEmblems().pipe(map(e => this.emblems = e))

  getSelectedEmblemUrl = (): string => this.getEmblemUrl(this.form.get('emblemId').value);

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  join = (): void => {
    this.submitAttempted = true;
    if (this.form.valid) {
      this.service.joinRoom(this.getModel()).subscribe(() => this.joined.emit(true));
    }
  }

  setEmblem = (id: number): void => this.form.get('emblemId').setValue(id);

  getModel = (): JoinRoomRequest => <JoinRoomRequest>{
    roomId: this.form.get('roomId').value,
    name: this.form.get('name').value,
    emblemId: this.form.get('emblemId').value
  }
}
