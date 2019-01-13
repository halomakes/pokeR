import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule } from '@angular/forms';
import { RoomInfoComponent } from './room-info/room-info.component';
import { JoinRoomComponent } from './join-room/join-room.component';

@NgModule({
  declarations: [CreateRoomComponent, NotificationFeedComponent, NotificationComponent, RoomInfoComponent, JoinRoomComponent],
  imports: [
    CommonModule,
    FormsModule
  ], exports: [
    NotificationFeedComponent,
    CreateRoomComponent,
    RoomInfoComponent
  ]
})
export class SharedComponentsModule { }
