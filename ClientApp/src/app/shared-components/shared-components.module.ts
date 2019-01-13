import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateRoomComponent, NotificationFeedComponent, NotificationComponent],
  imports: [
    CommonModule,
    FormsModule
  ], exports: [
    NotificationFeedComponent,
    CreateRoomComponent
  ]
})
export class SharedComponentsModule { }
