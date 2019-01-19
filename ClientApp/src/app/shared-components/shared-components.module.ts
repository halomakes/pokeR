import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule } from '@angular/forms';
import { RoomInfoComponent } from './room-info/room-info.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CardListComponent } from './card-list/card-list.component';
import { PlayfieldComponent } from './playfield/playfield.component';

@NgModule({
  declarations: [
    CreateRoomComponent,
    NotificationFeedComponent,
    NotificationComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent,
    PlayfieldComponent
  ], imports: [
    CommonModule,
    FormsModule
  ], exports: [
    NotificationFeedComponent,
    CreateRoomComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent
  ]
})
export class SharedComponentsModule { }
