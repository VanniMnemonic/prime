import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AssetService } from '../services/asset.service';
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
  ],
  templateUrl: './assets.html',
  styleUrl: './assets.css',
})
export class Assets implements OnInit {
  assetService = inject(AssetService);
  cdr = inject(ChangeDetectorRef);

  assets: any[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  selectedAsset: any;
  drawerVisible: boolean = false;
  formDrawerVisible: boolean = false;
  editingAsset: any = null;

  items: MenuItem[] = [
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

  ngOnInit() {
    this.loadAssets();
  }

  setMenuAsset(asset: any) {
    this.selectedAsset = asset;
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
