import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  public confettiPlz: EventEmitter<number> = new EventEmitter<number>();

  public pop = (): void => this.confettiPlz.emit(5000);
}
