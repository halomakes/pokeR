import { Component, OnInit, Input, ComponentRef, AfterViewInit } from '@angular/core';
import { PokerService } from 'src/app/services/poker.service';
import { User } from 'src/app/models/entities/user';

@Component({
  selector: 'app-playfield-card',
  templateUrl: './playfield-card.component.html',
  styleUrls: ['./playfield-card.component.scss']
})
export class PlayfieldCardComponent implements AfterViewInit {
  isRevealed = false;
  isExiting = false;
  initialized = false;
  @Input() user: User;
  @Input() public selfRef: ComponentRef<PlayfieldCardComponent>;
  private rotation: number;

  constructor(private service: PokerService) {
    this.rotation = (Math.random() * 16) - 8;
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => this.initialized = true, 10);
  }

  reveal = (timeout?: number): any => timeout ? window.setTimeout(() => this.isRevealed = true, timeout) : this.isRevealed = true;

  withdraw = (): void => {
    this.isExiting = true;
  };

  getEmblemUrl = (id: number): string => this.service.getEmblemUrl(id);

  onAnimationEnd = (e: AnimationEvent) => {
    if (e.animationName === 'withdraw') {
      try {
        this.selfRef.destroy();
      } catch {
      }
    }
  }

  getStyle = (): any => ({
    'transform': `rotateZ(${this.rotation}deg)`
  })
}
