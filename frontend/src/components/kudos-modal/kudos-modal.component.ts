import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models';

@Component({
  selector: 'app-kudos-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kudos-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KudosModalComponent {
  targetEmployee = input.required<Employee>();
  currentUser = input.required<Employee>();
  close = output<void>();
  send = output<{ to: Employee, amount: number, message: string }>();

  kudosAmount = signal(10);
  kudosMessage = signal('');
  isSending = signal(false);

  onSendKudos() {
    if (this.kudosAmount() > 0 && this.currentUser().kudosBalance >= this.kudosAmount() && !this.isSending()) {
        this.isSending.set(true);
        // Don't need a timeout, the parent component closing the modal handles the state change
        this.send.emit({
            to: this.targetEmployee(),
            amount: this.kudosAmount(),
            message: this.kudosMessage()
        });
        // No need to set isSending back to false, as the modal will be destroyed.
    }
  }

  onClose() {
    this.close.emit();
  }
}