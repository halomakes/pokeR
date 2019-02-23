import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public messages: EventEmitter<string>;

  constructor() {
    this.messages = new EventEmitter<string>();
  }

  public notify = (msg: string) => this.messages.emit(msg);
}
