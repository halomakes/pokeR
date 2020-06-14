import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomInfoComponent } from './room-info/room-info.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { CardListComponent } from './card-list/card-list.component';
import { PlayfieldComponent } from './playfield/playfield.component'
import { AppRoutingModule } from '../app-routing.module';
import { ConfettiComponent } from './confetti/confetti.component';
import { EntrywayComponent } from './entryway/entryway.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { FindRoomComponent } from './find-room/find-room.component';
import { BackgroundCardsComponent } from './background-cards/background-cards.component';
import { RosterComponent } from './roster/roster.component';
import { PaneDrawerComponent } from './pane-drawer/pane-drawer.component';
import { HostControlsComponent } from './host-controls/host-controls.component';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    CreateRoomComponent,
    NotificationFeedComponent,
    NotificationComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent,
    PlayfieldComponent,
    RosterComponent,
    ConfettiComponent,
    EntrywayComponent,
    ThemeSwitcherComponent,
    FindRoomComponent,
    BackgroundCardsComponent,
    PaneDrawerComponent,
    HostControlsComponent
  ], imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    AppRoutingModule,
    ReactiveFormsModule
  ], exports: [
    NotificationFeedComponent,
    CreateRoomComponent,
    RoomInfoComponent,
    JoinRoomComponent,
    CardListComponent,
    PlayfieldComponent,
    RosterComponent,
    ConfettiComponent,
    EntrywayComponent,
    ThemeSwitcherComponent,
    BackgroundCardsComponent,
    PaneDrawerComponent,
    HostControlsComponent
  ]
})
export class SharedComponentsModule { }
