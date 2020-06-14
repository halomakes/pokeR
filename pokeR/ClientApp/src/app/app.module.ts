import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';
import { NotificationComponent } from './shared-components/notification/notification.component';
import { SharedComponentsModule } from './shared-components/shared-components.module';

import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    FormsModule,
    TooltipModule,
    SharedComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NotificationComponent
  ]
})
export class AppModule { }
