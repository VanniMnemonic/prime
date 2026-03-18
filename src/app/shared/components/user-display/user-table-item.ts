import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ImageDisplay } from '../image-display/image-display';
import { LocationDisplay } from '../location-display';

@Component({
  selector: 'app-user-table-item',
  imports: [ImageDisplay, LocationDisplay, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <td>
      <app-image-display
        [image]="user().image_path"
        width="60px"
        height="60px"
        shape="square"
        icon="pi pi-user"
      />
    </td>
    <td>{{ user().title?.title }}</td>
    <td>{{ user().first_name }}</td>
    <td>{{ user().last_name }}</td>
    <td>{{ user().email }}</td>
    <td>
      @if (user().location) {
        <app-location-display [location]="user().location" />
      }
    </td>
    <td>{{ user().barcode }}</td>
    <td>
      @if (user().active_withdrawals > 0) {
        <p-tag
          [value]="user().active_withdrawals.toString()"
          severity="warn"
          class="text-center"
        />
      }
    </td>
  `,
})
export class UserTableItem {
  user = input.required<any>();
}
