
import { Component, ChangeDetectionStrategy, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Reward } from '../../models';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsComponent implements OnInit {
  dataService = inject(DataService);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  rewards = this.apiService.rewards;
  currentUser = this.authService.currentUser;
  redeem = output<Reward>();

  ngOnInit() {
    // Load rewards from API
    this.apiService.getAllRewards().subscribe();
  }

  onRedeem(reward: Reward) {
    this.redeem.emit(reward);
  }
}
