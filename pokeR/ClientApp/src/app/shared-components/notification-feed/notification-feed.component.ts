import { Component, OnInit, ComponentFactoryResolver, ComponentFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';

const baseTitle = 'PokeR';
const charDuration = 100;
const snipLength = 25;
const padCharacter = 10;

@Component({
  selector: 'app-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.scss']
})
export class NotificationFeedComponent implements OnInit {
  @ViewChild('notificationHolder', { read: ViewContainerRef }) notificationHolder: ViewContainerRef;

  private tickerTime: number;
  private lastTickerIndex = 0;

  constructor(private service: PokerService, private resolver: ComponentFactoryResolver,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.handleEvents().subscribe();
  }

  notify = (message: string) => {
    console.log('Notify:', message);
    this.createNotificationComponent(message);
    this.setTicker(message);
  }

  createNotificationComponent = (message: string) => {
    const factory: ComponentFactory<NotificationComponent> = this.resolver.resolveComponentFactory(NotificationComponent);
    const container = this.notificationHolder;
    const component = container.createComponent(factory);
    component.instance.message = message;
    component.instance.selfRef = component;
  }

  handleEvents = (): Observable<void> => forkJoin(
    this.handleJoins(),
    this.handleParts(),
    this.handleMessages()
  ).pipe(map(() => { }))

  handleJoins = (): Observable<void> => this.service.userJoins.pipe(map(j =>
    this.notify(`${j.delta.displayName} joined the room`)
  ))

  handleParts = (): Observable<void> => this.service.userLeaves.pipe(map(j =>
    this.notify(`${j.delta.displayName} left the room`)
  ))

  handleMessages = (): Observable<void> => this.notificationService.messages.pipe(map(this.notify));

  private setTicker = (msg: string): void => {
    window.clearInterval(this.tickerTime);
    this.lastTickerIndex = -snipLength + 1;
    this.tickerTime = window.setInterval(() => {
      const paddedTime = this.lastTickerIndex - padCharacter;
      const targetTime = paddedTime > 0 ? paddedTime : 0;
      const snip = msg.substring(targetTime, targetTime + snipLength);
      if (snip.length < 1) {
        this.endTicker();
      } else {
        document.title = `${baseTitle} • ${snip}`;
      }
      this.lastTickerIndex++;
    }, charDuration);
  }

  private endTicker = (): void => {
    window.clearInterval(this.tickerTime);
    document.title = baseTitle;
  }
}
