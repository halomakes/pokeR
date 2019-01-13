import { Component, OnInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.scss']
})
export class NotificationFeedComponent implements OnInit {

  constructor(private service: PokerService) { }

  ngOnInit() {
    this.handleEvents().subscribe();
  }

  notify = (message: string) => {
    console.log('Notify:', message);
  }

  handleEvents = (): Observable<void> => forkJoin(
    this.handleJoins(),
    this.handleParts()
  ).pipe(map(() => { }))

  handleJoins = (): Observable<void> => this.service.userJoins.pipe(map(j =>
    this.notify(`${j.delta.displayName} joined the room`)
  ))

  handleParts = (): Observable<void> => this.service.userLeaves.pipe(map(j =>
    this.notify(`${j.delta.displayName} left the room`)
  ))
}
