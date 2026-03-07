import { Component, inject, input, output, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AssetService } from '../../services/asset.service';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-asset-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    AvatarModule,
    FileUploadModule,
    InputNumberModule,
  ],
  templateUrl: './asset-form.html',
  styleUrl: './asset-form.css',
  providers: [MessageService],
})
export class AssetForm {
  fb = inject(FormBuilder);
  assetService = inject(AssetService);
  messageService = inject(MessageService);
  sanitizer = inject(DomSanitizer);

  asset = input<any>(null);
  onSave = output<void>();
  onCancel = output<void>();

  imagePath = signal<any>(null);

  form = this.fb.group({
    id: [null],
    denomination: ['', Validators.required],
    part_number: [''],
    barcode: [''],
    min_stock: [0, [Validators.required, Validators.min(0)]],
    image_path: [''],
  });

  constructor() {
    effect(() => {
      const a = this.asset();
      if (a) {
        this.form.patchValue(a);
        
        if (a.image_path) {
          this.imagePath.set(this.sanitizer.bypassSecurityTrustUrl(a.image_path));
        } else {
          this.imagePath.set(null);
        }
      } else {
        this.form.reset({ min_stock: 0 });
        this.imagePath.set(null);
      }
    });
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // In a real app, you would upload the file here
      // For this electron app, we'll use the file path or a dummy URL
      // Since the browser can't access local files directly without proper handling
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath.set(e.target.result);
        // We'll store the base64 or path in the form
        // In a real electron app with the backend handler we set up:
        // window.electronAPI.uploadImage(file.path) -> returns local-resource://...
        // For now, let's assume we get a path back. 
        // We'll just simulate setting the path for now or use the base64 for display
        this.form.patchValue({ image_path: file.path || e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  async save() {
    if (this.form.invalid) {
      return;
    }

    const assetData = this.form.value;
    try {
      if (assetData.id) {
        await this.assetService.update(assetData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asset updated successfully',
        });
      } else {
        await this.assetService.create(assetData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asset created successfully',
        });
      }
      this.onSave.emit();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save asset',
      });
      console.error(error);
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
