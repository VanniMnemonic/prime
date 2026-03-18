import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { UserService } from '../../services/user.service';

import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { StepperModule } from 'primeng/stepper';
import { TitleService } from '../../services/title.service';
import { LocationSelect } from '../../shared/components/location-select/location-select';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    FormsModule,
    LocationSelect,
    ImageModule,
    FileUploadModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
  providers: [MessageService],
})
export class UserForm {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  titleService = inject(TitleService);
  messageService = inject(MessageService);
  sanitizer = inject(DomSanitizer);

  user = input<any>(null);
  onSave = output<void>();
  onCancel = output<void>();

  titles: any[] = [];
  imagePath = signal<any>(null);

  titleDialogVisible = false;
  newTitle = '';

  form = this.fb.group({
    id: [null],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: [''],
    barcode: [''],
    location: [null],
    title: [null as any],
    image_path: [''],
  });

  constructor() {
    console.log('UserForm constructor called');
    this.loadTitles();

    effect(() => {
      const u = this.user();
      console.log('UserForm effect triggered with user:', u);
      if (u) {
        this.form.patchValue(u);

        // Handle image path protocol for display
        // If it starts with local-resource://, we can use it directly if we registered the protocol
        // Or if we need to bypass security in dev mode
        if (u.image_path) {
          this.imagePath.set(this.sanitizer.bypassSecurityTrustUrl(u.image_path));
        } else {
          this.imagePath.set(null);
        }
      } else {
        this.form.reset();
        this.imagePath.set(null);
      }
    });
  }

  ngOnInit() {
    console.log('UserForm initialized');
  }

  async loadTitles() {
    const titles = await this.titleService.getAll();
    this.titles = titles.map((t) => ({ label: t.title, value: t }));
  }

  openTitleDialog() {
    this.newTitle = '';
    this.titleDialogVisible = true;
  }

  async saveTitle() {
    if (!this.newTitle) return;

    try {
      const newTitleObj = await this.titleService.create({ title: this.newTitle });
      const newOption = { label: newTitleObj.title, value: newTitleObj };
      this.titles = [...this.titles, newOption];

      this.form.patchValue({ title: newTitleObj });

      this.titleDialogVisible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Title added successfully',
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add title',
      });
    }
  }

  async onImageSelect(event: any) {
    const file = event.currentFiles?.[0] ?? event.files?.[0];
    if (!file) return;

    // Immediate preview from blob URL
    const previewUrl =
      file.objectURL ?? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    this.imagePath.set(previewUrl);

    // Persist via Electron upload
    const filePath = this.userService.getFilePath(file);
    if (filePath) {
      try {
        const uploadedPath = await this.userService.uploadImage(filePath);
        this.imagePath.set(this.sanitizer.bypassSecurityTrustUrl(uploadedPath));
        this.form.patchValue({ image_path: uploadedPath });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image uploaded successfully',
        });
      } catch (error) {
        console.error('Image upload failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload image',
        });
      }
    }
  }

  async save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    // Extract actual location object from TreeSelect node (which puts the node in the control)
    const location = formValue.location ?? null;

    const userData = {
      ...formValue,
      location: location,
    };

    try {
      if (userData.id) {
        await this.userService.update(userData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully',
        });
      } else {
        await this.userService.create(userData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully',
        });
      }
      this.onSave.emit();
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save user',
      });
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
