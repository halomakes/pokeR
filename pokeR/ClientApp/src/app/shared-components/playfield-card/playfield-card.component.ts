import { Component, Input, ComponentRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';

@Component({
  selector: 'app-playfield-card',
  templateUrl: './playfield-card.component.html',
  styleUrls: ['./playfield-card.component.scss']
})
export class PlayfieldCardComponent implements AfterViewInit, OnDestroy {
  isRevealed = false;
  isExiting = false;
  initialized = false;
  @Input() user: User;
  @Input() public selfRef: ComponentRef<PlayfieldCardComponent>;
  private rotation: number;
  private x: number = null;
  private y: number = null;
  trackerInterval: number;

  constructor(private service: PokerService) {
    this.rotation = (Math.random() * 16) - 8;
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => this.initialized = true, 10);
    this.trackTarget();
    this.trackerInterval = window.setInterval(this.trackTarget, 200);
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }

  public reveal = (timeout?: number): any => {
    console.log(`revealing ${this.user.currentCardId} with delay of ${timeout}`);
    timeout ? window.setTimeout(() => this.isRevealed = true, timeout) : this.isRevealed = true;
  }

  public withdraw = (): void => {
    this.stopTracking();
    this.isExiting = true;
  };

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  onAnimationEnd = (e: AnimationEvent) => {
    if (e.animationName === 'withdraw' || e.animationName === 'withdraw-revealed') {
      try {
        this.selfRef.destroy();
      } catch {
      }
    }
  }

  getStyle = (): any => ({
    'transform': `rotateZ(${this.rotation}deg)`,
    'top': this.y != null ? `${this.y}px` : 'initial',
    'left': this.x != null ? `${this.x}px` : 'initial'
  })

  private trackTarget = (): void => {
    const tracker = document.getElementById(`card-${this.user.id}`);
    if (tracker) {
      const rect = tracker.getBoundingClientRect();
      this.x = rect.left;
      this.y = rect.top;
    }
  }

  private stopTracking = (): void => {
    if (this.trackerInterval) {
      window.clearInterval(this.trackerInterval);
      this.trackerInterval = null;
    }
  }
}
