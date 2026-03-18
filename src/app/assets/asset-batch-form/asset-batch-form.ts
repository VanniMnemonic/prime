import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { BatchService } from '../../services/batch.service';
import { LocationSelect } from '../../shared/components/location-select/location-select';

@Component({
  selector: 'app-asset-batch-form',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    AvatarModule,
    LocationSelect,
  ],
  templateUrl: './asset-batch-form.html',
  styleUrl: './asset-batch-form.css',
  providers: [MessageService],
})
export class AssetBatchForm {
  batchService = inject(BatchService);
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);

  asset = input.required<any>();
  batch = input<any>(null); // Optional input for edit mode
  onSave = output<void>();
  onCancel = output<void>();

  // Form fields
  denomination = '';
  serialNumber = '';
  quantity = 1;
  expirationDate: Date | null = null;
  selectedLocation: any = null;

  loading = false;

  async ngOnInit() {
    const b = this.batch();
    if (b) {
      // Edit mode
      this.denomination = b.denomination;
      this.serialNumber = b.serial_number;
      this.quantity = b.quantity;
      this.expirationDate = b.expiration_date ? new Date(b.expiration_date) : null;
      if (b.location) {
        this.selectedLocation = b.location;
      }
    } else {
      // Create mode default
      this.denomination = `Batch - ${this.asset().denomination}`;
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  async submit() {
    if (!this.quantity || this.quantity < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Quantity must be a positive number',
      });
      return;
    }

    try {
      this.loading = true;
      const batchData = {
        asset: this.asset(),
        denomination: this.denomination,
        serial_number: this.serialNumber,
        quantity: this.quantity,
        expiration_date: this.expirationDate,
        location: this.selectedLocation ?? null,
      };

      if (this.batch()) {
        // Update existing batch
        await this.batchService.update({ ...batchData, id: this.batch().id });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Batch updated successfully',
        });
      } else {
        // Create new batch
        await this.batchService.create(batchData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Batch created successfully',
        });
      }

      this.onSave.emit();
    } catch (error) {
      console.error('Error saving batch:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save batch',
      });
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
