import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { ImageDisplay } from '../image-display/image-display';
import { LocationDisplay } from '../location-display';

@Component({
  selector: 'app-user-full-detail',
  imports: [ImageDisplay, LocationDisplay, ButtonModule, TooltipModule, ImageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-6 px-6">
      <div class="flex-none">
        @if (user().image_path) {
          <p-image
            [src]="user().image_path"
            [preview]="true"
            width="180"
            class="rounded-xl overflow-hidden"
            [imageStyle]="{ 'object-fit': 'cover', height: '180px', width: '180px' }"
          />
        } @else {
          <div
            class="w-[180px] aspect-square bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex items-center justify-center text-muted-color"
          >
            <i class="pi pi-user text-6xl"></i>
          </div>
        }
      </div>

      <div class="flex-1 min-w-[250px] flex flex-col gap-4">
        <div class="flex flex-col">
          <span class="text-muted-color">{{ user().title?.title }}</span>
          <span class="text-xl font-bold">{{ user().first_name }} {{ user().last_name }}</span>
          <span class="text-muted-color flex items-center gap-2">
            {{ user().email }}
            <p-button
              icon="pi pi-copy"
              [text]="true"
              [rounded]="true"
              severity="secondary"
              pTooltip="Copy email"
              tooltipPosition="top"
              (onClick)="copyEmail.emit(user().email)"
            />
          </span>
          <span>
            <app-location-display [location]="user().location" />
          </span>
        </div>
      </div>
    </div>
  `,
})
export class UserFullDetail {
  user = input.required<any>();
  copyEmail = output<string>();
}
