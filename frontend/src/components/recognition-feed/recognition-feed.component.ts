import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-recognition-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recognition-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecognitionFeedComponent {
  dataService = inject(DataService);

  // Sort feed chronologically, newest first
  sortedFeed = computed(() => {
    return this.dataService.kudosFeed().slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });
}
