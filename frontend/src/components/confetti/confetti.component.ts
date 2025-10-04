import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confetti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent {}
