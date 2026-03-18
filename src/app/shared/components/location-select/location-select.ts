import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeSelectModule } from 'primeng/treeselect';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-location-select',
  imports: [TreeSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationSelect),
      multi: true,
    },
  ],
  template: `
    <p-treeSelect
      [options]="locations()"
      [ngModel]="selected()"
      (ngModelChange)="onNodeSelected($event)"
      [placeholder]="placeholder()"
      [filter]="true"
      filterBy="label"
      selectionMode="single"
      appendTo="body"
      [disabled]="disabled()"
      styleClass="w-full"
      containerStyleClass="w-full"
    />
  `,
})
export class LocationSelect implements ControlValueAccessor, OnInit {
  private locationService = inject(LocationService);
  private cdr = inject(ChangeDetectorRef);

  placeholder = input<string>('Select a Location');
  disabled = input<boolean>(false);

  locations = signal<TreeNode[]>([]);
  selected = signal<TreeNode | null>(null);

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  async ngOnInit() {
    const raw = await this.locationService.getAll();
    this.locations.set(this.buildTree(raw));
    this.cdr.markForCheck();
  }

  private buildTree(locations: any[]): TreeNode[] {
    const map = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    for (const loc of locations) {
      map.set(loc.id, {
        key: loc.id.toString(),
        label: loc.denomination,
        data: loc,
        children: [],
        expanded: true,
      });
    }

    for (const loc of locations) {
      const node = map.get(loc.id)!;
      if (loc.parent_id) {
        const parent = map.get(loc.parent_id);
        if (parent) {
          parent.children!.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /** Finds the TreeNode in the tree that matches the given location id. */
  private findNode(nodes: TreeNode[], id: number): TreeNode | null {
    for (const node of nodes) {
      if (node.data?.id === id) return node;
      if (node.children?.length) {
        const found = this.findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  onNodeSelected(node: TreeNode | null) {
    this.selected.set(node);
    this.onTouched();
    // Emit the raw location object so consumers don't have to unwrap `.data`
    this.onChange(node?.data ?? null);
  }

  // --- ControlValueAccessor ---

  writeValue(value: any): void {
    if (!value) {
      this.selected.set(null);
      this.cdr.markForCheck();
      return;
    }

    // Accept either a raw location object or an already-wrapped TreeNode
    const id: number | undefined = value?.id ?? value?.data?.id;

    if (id !== undefined) {
      // Tree may not be loaded yet — wait for it then resolve
      const resolve = () => {
        const node = this.findNode(this.locations(), id);
        this.selected.set(
          node ?? {
            key: id.toString(),
            label: value.denomination ?? value.label ?? '',
            data: value?.data ?? value,
          },
        );
        this.cdr.markForCheck();
      };

      if (this.locations().length) {
        resolve();
      } else {
        // Retry after the async ngOnInit populates locations
        setTimeout(resolve, 0);
      }
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // `disabled` is a signal input so it's controlled by the parent;
    // this hook is here to satisfy the interface — the binding flows naturally
    // via the input() when used with reactive forms.
  }
}
