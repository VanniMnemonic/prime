import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { BatchService } from '../services/batch.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { AssetDetail } from './asset-detail/asset-detail';
import { AssetForm } from './asset-form/asset-form';
import { AssetBatchForm } from './asset-batch-form/asset-batch-form';
import { LocationDisplay } from '../shared/components/location-display';
import { TagModule } from 'primeng/tag';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-assets',
  imports: [
    TableModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    AvatarModule,
    SplitButtonModule,
    DrawerModule,
    AssetDetail,
    AssetForm,
    AssetBatchForm,
    LocationDisplay,
    TagModule,
  ],
  templateUrl: './assets.html',
  styleUrl: './assets.css',
})
export class Assets implements OnInit {
  assetService = inject(AssetService);
  batchService = inject(BatchService);
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);

  assets: any[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  selectedAsset: any;
  drawerVisible: boolean = false;
  formDrawerVisible: boolean = false;
  batchFormDrawerVisible: boolean = false;
  editingAsset: any = null;

  // Cache for asset batches
  assetBatches: { [key: number]: any[] } = {};
  loadingBatches: { [key: number]: boolean } = {};
  expandedRows: { [key: string]: boolean } = {};
  selectedBatch: any = null;

  items: MenuItem[] = [
    {
      label: 'View Details',
      icon: 'pi pi-eye',
      command: () => {
        this.openDetail(this.selectedAsset);
      },
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        console.log('Edit asset:', this.selectedAsset);
        this.openEditAsset(this.selectedAsset);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        console.log('Delete asset:', this.selectedAsset);
        // TODO: Implement delete logic
      },
    },
  ];

  batchItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        console.log('Edit batch:', this.selectedBatch);
        this.openEditBatch(this.selectedBatch);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        console.log('Delete batch:', this.selectedBatch);
        // TODO: Implement batch delete logic
      },
    },
  ];

  ngOnInit() {
    this.loadAssets();
  }

  openEditBatch(batch: any) {
    // Find the asset this batch belongs to (it's in assetBatches but we need the asset object)
    // The batch object from the table usually has relations if loaded correctly, 
    // or we can find it from the expanded row.
    // However, in the template: let-asset let-expanded="expanded" -> p-table [value]="assetBatches[asset.id]" let-batch
    // So 'batch' is the object. 'asset' is the parent row.
    // We need to set selectedAsset to the parent asset.
    
    // Since we are inside the splitButton dropdown click, we set this.selectedBatch = batch.
    // But we don't have direct access to 'asset' here easily unless we pass it.
    // Let's modify setMenuBatch to take asset as well or find it.
    // Actually, batch entity has 'asset' relation if loaded.
    // Let's check backend: ipcMain.handle('get-batches-by-asset'...) relations: ['location', 'location.parent']
    // It does NOT load 'asset' relation by default in get-batches-by-asset.
    
    // We need to pass the asset to setMenuBatch or find it.
    // In the template: (onDropdownClick)="setMenuBatch(batch, asset)"
    
    this.selectedAsset = this.assets.find(a => a.id === batch.asset?.id) || this.selectedAsset; 
    // Wait, if batch.asset is not loaded, we can't find it.
    // But we are in the nested table of an asset row.
    
    // Let's rely on setMenuBatch(batch, asset) which we need to update in template.
    this.batchFormDrawerVisible = true;
  }

  setMenuAsset(asset: any) {
    this.selectedAsset = asset;
  }

  setMenuBatch(batch: any, asset?: any) {
    this.selectedBatch = batch;
    if (asset) {
        this.selectedAsset = asset;
    }
  }

  openAddBatch(asset: any) {
    this.selectedAsset = asset;
    this.selectedBatch = null; // Clear selected batch for add mode
    this.batchFormDrawerVisible = true;
  }

  withdrawBatch(batch: any) {
    console.log('Withdraw batch:', batch);
    // TODO: Implement withdrawal logic
    // For now, we can perhaps emit an event or navigate to withdrawals, 
    // or open a withdrawal dialog if we had one here.
    // Given the current architecture, maybe we should just log it or 
    // add a TODO to integrate with the withdrawal module.
  }

  getSafeUrl(path: string) {
    if (!path) return null;
    return this.sanitizer.bypassSecurityTrustUrl(path);
  }

  isExpired(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  isNearExpiry(date: string): boolean {
    if (!date) return false;
    const expiry = new Date(date);
    const now = new Date();
    // Consider expired items as not "near expiry" (they are already expired)
    if (expiry < now) return false;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  }

  getQuantitySeverity(
    asset: any,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    if (asset.total_quantity < asset.min_stock) {
      return 'danger';
    }
    if (asset.total_quantity < asset.min_stock * 1.25) {
      return 'warn';
    }
    return 'success';
  }

  onRowExpand(event: any) {
    this.loadAssetBatches(event.data.id);
  }

  async loadAssetBatches(assetId: number, forceReload: boolean = false) {
    if (this.assetBatches[assetId] && !forceReload) {
      return; // Already loaded
    }

    this.loadingBatches[assetId] = true;
    // Force UI update to show loading state if used in template
    this.cdr.detectChanges();

    try {
      this.assetBatches[assetId] = await this.batchService.getByAsset(assetId);
      // Create a new reference for assetBatches to trigger change detection if bound directly
      this.assetBatches = { ...this.assetBatches };
    } catch (error) {
      console.error('Error loading batches for asset', assetId, error);
      this.assetBatches[assetId] = [];
    } finally {
      this.loadingBatches[assetId] = false;
      this.cdr.detectChanges();
    }
  }

  openDetail(asset: any) {
    this.selectedAsset = asset;
    this.drawerVisible = true;
  }

  openAddAsset() {
    this.editingAsset = null;
    this.formDrawerVisible = true;
  }

  openEditAsset(asset: any) {
    console.log('Edit asset from detail:', asset);
    this.editingAsset = asset;
    this.formDrawerVisible = true;
  }

  onFormSave() {
    this.formDrawerVisible = false;
    this.loadAssets();
  }

  async onBatchFormSave() {
    this.batchFormDrawerVisible = false;
    await this.loadAssets();

    // Invalidate and reload batches for the selected asset
    if (this.selectedAsset) {
      // Force reload batches
      await this.loadAssetBatches(this.selectedAsset.id, true);

      // Auto-expand the row
      this.expandedRows = { ...this.expandedRows, [this.selectedAsset.id]: true };
      this.cdr.detectChanges();
    }
  }

  onFormCancel() {
    this.formDrawerVisible = false;
  }

  async loadAssets() {
    try {
      this.loading = true;
      this.assets = await this.assetService.getAll();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
