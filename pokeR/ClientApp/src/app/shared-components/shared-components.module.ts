import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomInfoComponent } from './room-info/room-info.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CardListComponent } from './card-list/card-list.component';
import { PlayfieldComponent } from './playfield/playfield.component';
import { RoundStatusComponent } from './round-status/round-status.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    CreateRoomComponent,
    NotificationFeedComponent,
    NotificationComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent,
    PlayfieldComponent,
    RoundStatusComponent
  ], imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule
  ], exports: [
    NotificationFeedComponent,
    CreateRoomComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent,
    PlayfieldComponent,
    RoundStatusComponent
  ]
})
export class SharedComponentsModule { }
