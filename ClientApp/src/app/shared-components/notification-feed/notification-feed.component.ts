import { Component, OnInit, ComponentFactoryResolver, ComponentFactory, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.scss']
})
export class NotificationFeedComponent implements OnInit {
  @ViewChild('notificationHolder', { read: ViewContainerRef }) notificationHolder: ViewContainerRef;

  constructor(private service: PokerService, private resolver: ComponentFactoryResolver,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.handleEvents().subscribe();
  }

  notify = (message: string) => {
    console.log('Notify:', message);
    this.createNotificationComponent(message);
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
}
