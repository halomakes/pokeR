import { Component, OnInit, Input, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input()
  public message: string;

  @Input()
  public selfRef: ComponentRef<NotificationComponent>;

  hide: boolean;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.dismiss();
    }, 10000);
  }

  dismiss = (): void => {
    try {
      this.selfRef.destroy();
    } catch {
      this.hide = true;
    }
  }
}
