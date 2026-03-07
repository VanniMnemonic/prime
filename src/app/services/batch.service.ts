import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  private electronService = inject(ElectronService);

  async getByAsset(assetId: number): Promise<any[]> {
    return await this.electronService.invoke('get-batches-by-asset', assetId);
  }
}
