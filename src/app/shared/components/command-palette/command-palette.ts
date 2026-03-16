import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';

type CommandId =
  | 'nav-dashboard'
  | 'nav-users'
  | 'nav-assets'
  | 'nav-withdrawals'
  | 'nav-locations'
  | 'nav-settings'
  | 'add-user'
  | 'add-asset'
  | 'add-withdrawal'
  | 'add-location';

type CommandItem = {
  id: CommandId;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  run: () => void;
};

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ListboxModule,
    ButtonModule,
    TagModule,
  ],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [modal]="true"
      [dismissableMask]="true"
      [draggable]="false"
      appendTo="body"
      [style]="{ width: '44rem' }"
      [breakpoints]="{ '960px': '90vw', '640px': '95vw' }"
      [header]="headerText"
    >
      <ng-template pTemplate="content">
        <div class="flex flex-col gap-3">
          <p-iconfield iconPosition="left">
            <p-inputicon>
              <i class="pi pi-search"></i>
            </p-inputicon>
            <input
              #searchInput
              pInputText
              type="text"
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
              (keydown.enter)="runSelected()"
              [placeholder]="placeholderText"
              class="w-full"
            />
          </p-iconfield>

          <p-listbox
            [options]="filteredCommands()"
            [ngModel]="selected()"
            (ngModelChange)="selected.set($event)"
            (onChange)="onListboxChange($event)"
            optionLabel="label"
            [listStyle]="{ maxHeight: '55vh' }"
            [emptyMessage]="emptyMessageText"
          >
            <ng-template let-c pTemplate="item">
              <div class="flex items-center gap-3 w-full">
                <i class="text-muted-color" [class]="c.icon"></i>
                <div class="flex flex-col overflow-hidden flex-1">
                  <div class="font-medium truncate">{{ c.label }}</div>
                  @if (c.description) {
                    <div class="text-sm text-muted-color truncate">{{ c.description }}</div>
                  }
                </div>
                @if (c.badge) {
                  <p-tag [value]="c.badge" severity="secondary" />
                }
              </div>
            </ng-template>
          </p-listbox>
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class CommandPalette {
  router = inject(Router);

  visible = signal(false);
  query = signal('');
  selected = signal<CommandItem | null>(null);

  headerText = $localize`:@@commandPaletteHeader:Command Palette`;
  placeholderText = $localize`:@@commandPalettePlaceholder:Type a command...`;
  emptyMessageText = $localize`:@@commandPaletteEmpty:No commands found`;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private baseCommands = computed<CommandItem[]>(() => [
    {
      id: 'add-withdrawal',
      label: $localize`:@@commandAddWithdrawal:Add withdrawal`,
      description: $localize`:@@commandAddWithdrawalDescription:Create a new withdrawal`,
      icon: 'pi pi-plus',
      badge: this.hotkeyLabel(),
      run: () => this.router.navigate(['/withdrawals'], { queryParams: { action: 'add' } }),
    },
    {
      id: 'add-user',
      label: $localize`:@@commandAddUser:Add user`,
      description: $localize`:@@commandAddUserDescription:Create a new user`,
      icon: 'pi pi-user-plus',
      run: () => this.router.navigate(['/users'], { queryParams: { action: 'add' } }),
    },
    {
      id: 'add-asset',
      label: $localize`:@@commandAddAsset:Add asset`,
      description: $localize`:@@commandAddAssetDescription:Create a new asset`,
      icon: 'pi pi-box',
      run: () => this.router.navigate(['/assets'], { queryParams: { action: 'add' } }),
    },
    {
      id: 'add-location',
      label: $localize`:@@commandAddLocation:Add location`,
      description: $localize`:@@commandAddLocationDescription:Create a new location`,
      icon: 'pi pi-map-marker',
      run: () => this.router.navigate(['/locations'], { queryParams: { action: 'add' } }),
    },
    {
      id: 'nav-dashboard',
      label: $localize`:@@commandGoDashboard:Go to dashboard`,
      icon: 'pi pi-home',
      run: () => this.router.navigate(['/dashboard']),
    },
    {
      id: 'nav-users',
      label: $localize`:@@commandGoUsers:Go to users`,
      icon: 'pi pi-user',
      run: () => this.router.navigate(['/users']),
    },
    {
      id: 'nav-assets',
      label: $localize`:@@commandGoAssets:Go to assets`,
      icon: 'pi pi-box',
      run: () => this.router.navigate(['/assets']),
    },
    {
      id: 'nav-withdrawals',
      label: $localize`:@@commandGoWithdrawals:Go to withdrawals`,
      icon: 'pi pi-upload',
      run: () => this.router.navigate(['/withdrawals']),
    },
    {
      id: 'nav-locations',
      label: $localize`:@@commandGoLocations:Go to locations`,
      icon: 'pi pi-map-marker',
      run: () => this.router.navigate(['/locations']),
    },
    {
      id: 'nav-settings',
      label: $localize`:@@commandGoSettings:Go to settings`,
      icon: 'pi pi-cog',
      run: () => this.router.navigate(['/settings']),
    },
  ]);

  filteredCommands = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.baseCommands();
    const filtered = q
      ? list.filter((c) => {
          const hay = `${c.label} ${c.description ?? ''}`.toLowerCase();
          return hay.includes(q);
        })
      : list;
    return filtered;
  });

  constructor() {
    effect(() => {
      const filtered = this.filteredCommands();
      const current = this.selected();
      if (!current || !filtered.some((c) => c.id === current.id)) {
        this.selected.set(filtered[0] ?? null);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const isOpen = this.visible();

    if ((event.metaKey || event.ctrlKey) && key === 'k') {
      event.preventDefault();
      this.open();
      return;
    }

    if (isOpen && key === 'enter') {
      const el = document.activeElement;
      const tag = (el as HTMLElement | null)?.tagName?.toLowerCase?.() ?? '';
      if (tag !== 'input' && tag !== 'textarea') {
        event.preventDefault();
        this.runSelected();
      }
    }

    if (isOpen && key === 'escape') {
      event.preventDefault();
      this.close();
    }
  }

  open() {
    this.visible.set(true);
    this.query.set('');
    queueMicrotask(() => {
      const first = this.filteredCommands()[0] ?? null;
      this.selected.set(first);
      this.searchInput?.nativeElement?.focus?.();
      this.searchInput?.nativeElement?.select?.();
    });
  }

  close() {
    this.visible.set(false);
  }

  runSelected() {
    const cmd = this.selected();
    if (!cmd) return;
    this.close();
    queueMicrotask(() => cmd.run());
  }

  onListboxChange(event: any) {
    const value = (event as any)?.value as CommandItem | undefined;
    if (value) this.selected.set(value);
    if ((event as any)?.originalEvent?.type === 'click') {
      this.runSelected();
    }
  }

  private hotkeyLabel(): string {
    return navigator.platform.toLowerCase().includes('mac') ? '⌘K' : 'Ctrl+K';
  }
}
