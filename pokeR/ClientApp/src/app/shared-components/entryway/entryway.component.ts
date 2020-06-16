import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-entryway',
  templateUrl: './entryway.component.html',
  styleUrls: ['./entryway.component.scss']
})
export class EntrywayComponent {
  @Output() exit: EventEmitter<any[]> = new EventEmitter<any[]>();
  public action: string = null;
  constructor() { }

  onExit = (route: any[]): void => this.exit.emit(route);
}
