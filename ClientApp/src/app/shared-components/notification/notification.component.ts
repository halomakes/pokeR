import { Component, OnInit, Input, ComponentRef, HostBinding } from '@angular/core';

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

  @HostBinding('class.w-100') width = true;
  @HostBinding('class.click-normal') click = true;

  hide: boolean;
  animOut = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.dismiss();
    }, 10000);
  }

  dismiss = (): boolean => this.animOut = true;

  transitionEnd = (e: AnimationEvent) => {
    if (e.animationName === 'fadeOutUp') {
      try {
        this.selfRef.destroy();
      } catch {
        this.hide = true;
      }
    }
  }
}
