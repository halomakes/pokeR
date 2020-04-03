import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, flatMap, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-find-room',
  templateUrl: './find-room.component.html',
  styleUrls: ['./find-room.component.scss']
})
export class FindRoomComponent implements OnInit {
  public exists: boolean = null;
  form: FormGroup = new FormGroup({
    roomId: new FormControl('', Validators.required)
  });

  constructor(
    private service: PokerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.watchIdChanges().subscribe();
  }

  onSubmit = (): void => {
    if (this.form.valid && this.exists) {
      const id = this.form.get('roomId').value;
      this.router.navigate(['/room', id]);
    }
  }

  watchIdChanges = (): Observable<any> => this.form.get('roomId').valueChanges.pipe(
    debounceTime(300),
    flatMap(this.service.checkAvailability),
    map(r => this.exists = !r)
  )
}
