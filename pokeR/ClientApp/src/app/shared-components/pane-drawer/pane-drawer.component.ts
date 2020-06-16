import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pane-drawer',
  templateUrl: './pane-drawer.component.html',
  styleUrls: ['./pane-drawer.component.scss']
})
export class PaneDrawerComponent {
  @Input() label: string;
  @Input() direction: string = 'left';
  open = false;
  togglePanel = () => this.open = !this.open;

  constructor() { }
}
