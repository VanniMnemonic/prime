import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ImageDisplay } from '../image-display/image-display';

@Component({
  selector: 'app-user-summary',
  imports: [ImageDisplay, ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="
        size() === 'sm'
          ? 'flex items-center gap-3 p-3 border rounded-lg border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-950 opacity-75'
          : 'flex items-center gap-4 p-4 border rounded-xl border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-950 opacity-75'
      "
    >
      <app-image-display
        [image]="user().image_path"
        [width]="size() === 'sm' ? '40px' : '50px'"
        [height]="size() === 'sm' ? '40px' : '50px'"
        shape="circle"
        icon="pi pi-user"
      />
      <div class="flex flex-col" [class.overflow-hidden]="size() === 'sm'">
        <span [class]="size() === 'sm' ? 'font-bold truncate' : 'font-bold'"
          >{{ user().first_name }} {{ user().last_name }}</span
        >
        @if (size() === 'sm') {
          <span class="text-xs text-muted-color" i18n="@@withdrawalSummaryUser">User</span>
        } @else {
          <span class="text-sm text-muted-color" i18n="@@withdrawalSelectedUserLabel">Selected User</span>
        }
      </div>
      <div class="ml-auto">
        <p-button
          icon="pi pi-pencil"
          severity="secondary"
          [text]="true"
          [size]="size() === 'sm' ? 'small' : undefined"
          (onClick)="onEdit.emit()"
          pTooltip="Edit User"
          i18n-pTooltip="@@withdrawalEditUserTooltip"
        />
      </div>
    </div>
  `,
})
export class UserSummary {
  user = input.required<any>();
  size = input<'sm' | 'md'>('md');
  onEdit = output<void>();
}
