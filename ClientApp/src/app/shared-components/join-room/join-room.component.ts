import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { JoinRoomRequest } from 'src/app/models/join-room-request';
import { PokerService } from 'src/app/services/poker.service';
import { Emblem } from 'src/app/models/entities/emblem';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  model: JoinRoomRequest = new JoinRoomRequest();
  emblems: Emblem[] = new Array<Emblem>();

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.loadEmblems().subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.roomId.currentValue) {
      this.model.roomId = changes.roomId.currentValue;
    }
  }

  loadEmblems = (): Observable<Emblem[]> =>
    this.service.getEmblems().pipe(map(e => this.emblems = e))

  getSelectedEmblemUrl = (): string => this.getEmblemUrl(this.model.emblemId);

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  join = () => this.service.joinRoom(this.model).subscribe(() => this.joined.emit(true));
}
