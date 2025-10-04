
import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Reward } from '../../models';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsComponent {
  dataService = inject(DataService);
  rewards = this.dataService.rewards;
  currentUser = this.dataService.currentUser;
  redeem = output<Reward>();

  onRedeem(reward: Reward) {
    this.redeem.emit(reward);
  }
}
