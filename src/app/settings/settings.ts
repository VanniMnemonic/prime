import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ElectronService } from '../services/electron';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  providers: [ConfirmationService, MessageService],
})
export class Settings {
  electronService = inject(ElectronService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  loading = false;

  resetDatabase() {
    this.confirmationService.confirm({
      header: 'Reset Database',
      message: 'Are you sure you want to delete all data? This action cannot be undone.',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          this.loading = true;
          await this.electronService.invoke('reset-db');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Database has been reset. Please restart the app.',
          });
        } catch (error) {
          console.error('Error resetting database:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reset database',
          });
        } finally {
          this.loading = false;
        }
      },
    });
  }

  seedDatabase() {
    this.confirmationService.confirm({
      header: 'Seed Database',
      message: 'This will add mock data to the database. Continue?',
      icon: 'pi pi-info-circle',
      accept: async () => {
        try {
          this.loading = true;
          await this.electronService.invoke('seed-db');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Mock data seeded successfully.',
          });
        } catch (error) {
          console.error('Error seeding database:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to seed database',
          });
        } finally {
          this.loading = false;
        }
      },
    });
  }
}
