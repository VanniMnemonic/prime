import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { LocationService } from '../services/location.service';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { LocationForm } from './location-form/location-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locations',
  imports: [OrganizationChartModule, ButtonModule, DrawerModule, LocationForm, CommonModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations implements OnInit {
  locationService = inject(LocationService);
  cdr = inject(ChangeDetectorRef);

  data: TreeNode[] = [];
  loading: boolean = true;
  drawerVisible: boolean = false;
  selectedLocation: any = null;

  ngOnInit() {
    this.loadLocations();
  }

  async loadLocations() {
    try {
      this.loading = true;
      const locations = await this.locationService.getAll();
      this.data = this.buildTree(locations);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  buildTree(locations: any[]): TreeNode[] {
    const locationMap = new Map<number, any>();
    const roots: TreeNode[] = [];

    // First pass: create nodes and map them by ID
    locations.forEach((loc) => {
      locationMap.set(loc.id, {
        label: loc.denomination,
        type: 'default',
        styleClass: '',
        expanded: true,
        data: loc,
        children: [],
        key: loc.id.toString(),
      });
    });

    // Second pass: build hierarchy
    locations.forEach((loc) => {
      const node = locationMap.get(loc.id);
      if (loc.parent) {
        const parent = locationMap.get(loc.parent.id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  addSubLocation(location: any) {
    this.selectedLocation = location;
    this.drawerVisible = true;
  }

  onLocationSaved() {
    this.drawerVisible = false;
    this.loadLocations();
  }
}

