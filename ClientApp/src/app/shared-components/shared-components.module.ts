import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [CreateRoomComponent, NotificationFeedComponent, NotificationComponent],
  imports: [
    CommonModule
  ], exports: [
    NotificationFeedComponent
  ]
})
export class SharedComponentsModule { }
