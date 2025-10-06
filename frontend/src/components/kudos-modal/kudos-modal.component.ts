import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../../models';

@Component({
    selector: 'app-kudos-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './kudos-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KudosModalComponent {
    targetEmployee = input.required<UserDTO>();
    currentUser = input.required<UserDTO>();
    close = output<void>();
    send = output<{ to: UserDTO, amount: number, message: string }>();

    kudosAmount = signal(10);
    kudosMessage = signal('');
    isSending = signal(false);

    onSendKudos() {
        // Convert to number to ensure proper comparison
        const amount = Number(this.kudosAmount());

        if (amount > 0 && this.currentUser().kudosBalance >= amount && !this.isSending()) {
            this.isSending.set(true);
            this.send.emit({
                to: this.targetEmployee(),
                amount: amount, // Use the converted number
                message: this.kudosMessage()
            });
        }
    }

    onClose() {
        this.close.emit();
    }

    // Add this method to handle number conversion
    onAmountChange(value: string | number) {
        this.kudosAmount.set(Number(value));
    }
}