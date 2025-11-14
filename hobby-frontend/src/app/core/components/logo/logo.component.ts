import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      [src]="src" 
      [alt]="alt" 
      [class]="className"
      [style.width.px]="size"
      [style.height.px]="size"
    />
  `,
  styles: [`
    img {
      object-fit: contain;
      display: block;
    }
  `]
})
export class LogoComponent {
  @Input() src: string = '/EventMeventLogo.svg';
  @Input() alt: string = 'Event Mevent Logo';
  @Input() size: number = 40;
  @Input() className: string = '';
}

