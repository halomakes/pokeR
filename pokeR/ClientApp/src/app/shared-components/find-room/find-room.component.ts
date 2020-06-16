import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { Observable } from 'rxjs';
import { debounceTime, flatMap, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-find-room',
  templateUrl: './find-room.component.html',
  styleUrls: ['./find-room.component.scss']
})
export class FindRoomComponent implements OnInit {
  @Output() exit: EventEmitter<any[]> = new EventEmitter<any[]>();
  public exists: boolean = null;
  form: FormGroup = new FormGroup({
    roomId: new FormControl('', Validators.required)
  });

  constructor(
    private service: PokerService
  ) { }

  ngOnInit() {
    this.watchIdChanges().subscribe();
  }

  onSubmit = (): void => {
    if (this.form.valid && this.exists) {
      const id = this.form.get('roomId').value;
      this.exit.emit(['/room', id]);
    }
  }

  watchIdChanges = (): Observable<any> => this.form.get('roomId').valueChanges.pipe(
    debounceTime(300),
    flatMap(this.service.checkAvailability),
    map(r => this.exists = !r)
  )
}
