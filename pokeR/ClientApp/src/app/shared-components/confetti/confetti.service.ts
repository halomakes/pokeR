import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  public confettiPlz: EventEmitter<{ duration: number, cheer?: boolean }> = new EventEmitter<{ duration: number, cheer?: boolean }>();

  public pop = (cheer?: boolean): void => this.confettiPlz.emit({ duration: 5000, cheer });
}
