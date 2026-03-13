import { Component, inject, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { WithdrawalService } from '../../services/withdrawal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ImageDisplay } from '../../shared/components/image-display/image-display';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-withdrawal-return-form',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    SliderModule,
    InputNumberModule,
    ImageDisplay,
    ConfirmPopupModule,
  ],
  templateUrl: './withdrawal-return-form.html',
  styleUrl: './withdrawal-return-form.css',
  providers: [ConfirmationService, MessageService],
})
export class WithdrawalReturnForm {
  withdrawalService = inject(WithdrawalService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  withdrawal = input<any | null>(null);
  onSave = output<void>();
  onCancel = output<void>();

  returnDate: Date = new Date();
  returnedQuantity: number = 0;
  inefficientQuantity: number = 0;
  loading = false;

  maxReturnQuantity = computed(() => {
    const w = this.withdrawal();
    if (!w) return 0;
    return w.quantity - (w.returned_quantity || 0);
  });

  constructor() {
    effect(() => {
      const max = this.maxReturnQuantity();
      if (max > 0) {
        this.returnedQuantity = max;
      }
      this.inefficientQuantity = 0;
    });
  }

  async submit(event?: Event) {
    const w = this.withdrawal();
    if (!w) return;

    try {
      if (w.must_return) {
        this.loading = true;
        await this.withdrawalService.return(
          w.id,
          this.returnDate,
          this.returnedQuantity,
          this.inefficientQuantity,
        );
      } else {
        const target = (event?.currentTarget ?? event?.target ?? undefined) as any;
        this.confirmationService.confirm({
          target,
          header: $localize`:@@confirmRestockHeader:Confirm Restock`,
          message: $localize`:@@confirmRestockMessage:This withdrawal was marked as consumed. Restock ${this.returnedQuantity}:returnedQuantity: item(s) anyway?`,
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: $localize`:@@confirmRestockAcceptLabel:Restock`,
          rejectLabel: $localize`:@@cancelButton:Cancel`,
          accept: async () => {
            try {
              this.loading = true;
              await this.withdrawalService.forceReturn(w.id, this.returnDate, this.returnedQuantity);
              this.messageService.add({
                severity: 'success',
                summary: $localize`:@@toastSuccessSummary:Success`,
                detail: $localize`:@@toastReturnSuccessDetail:Asset returned successfully`,
              });
              this.onSave.emit();
            } catch (error) {
              console.error('Error returning asset:', error);
              this.messageService.add({
                severity: 'error',
                summary: $localize`:@@toastErrorSummary:Error`,
                detail: $localize`:@@toastReturnErrorDetail:Failed to return asset`,
              });
            } finally {
              this.loading = false;
            }
          },
        });
        return;
      }
      this.messageService.add({
        severity: 'success',
        summary: $localize`:@@toastSuccessSummary:Success`,
        detail: $localize`:@@toastReturnSuccessDetail:Asset returned successfully`,
      });
      this.onSave.emit();
    } catch (error) {
      console.error('Error returning asset:', error);
      this.messageService.add({
        severity: 'error',
        summary: $localize`:@@toastErrorSummary:Error`,
        detail: $localize`:@@toastReturnErrorDetail:Failed to return asset`,
      });
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
