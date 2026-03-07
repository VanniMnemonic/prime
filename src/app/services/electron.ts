import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private ipcRenderer: any;
  private webUtils: any;

  constructor() {
    if (this.isElectron()) {
      const electron = (window as any).require('electron');
      this.ipcRenderer = electron.ipcRenderer;
      this.webUtils = electron.webUtils;
    }
  }

  isElectron(): boolean {
    return !!(window && (window as any).process && (window as any).process.type);
  }

  async invoke(channel: string, ...args: any[]): Promise<any> {
    if (this.isElectron()) {
      return await this.ipcRenderer.invoke(channel, ...args);
    }
    return null;
  }

  getFilePath(file: File): string {
    if (this.isElectron() && this.webUtils) {
      return this.webUtils.getPathForFile(file);
    }
    return (file as any).path;
  }

  // Deprecated: Use UserService instead
  async getUsers(): Promise<any[]> {
    return this.invoke('get-users');
  }

  // Deprecated: Use UserService instead
  async addUser(user: any): Promise<any> {
    return this.invoke('add-user', user);
  }
}
