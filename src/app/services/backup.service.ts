import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private electronService = inject(ElectronService);

  async exportBackup(): Promise<boolean> {
    return await this.electronService.invoke('export-backup');
  }

  async importBackup(): Promise<boolean> {
    return await this.electronService.invoke('import-backup');
  }
}
