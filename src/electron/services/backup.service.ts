import { app, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import unzipper from 'unzipper';

export class BackupService {
  private userDataPath = app.getPath('userData');
  private dbPath = path.join(this.userDataPath, 'prime.sqlite');
  private imagesDir = path.join(this.userDataPath, 'images');

  async exportBackup(): Promise<boolean> {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Backup',
      defaultPath: `prime-backup-${new Date().toISOString().split('T')[0]}.zip`,
      filters: [{ name: 'Zip Files', extensions: ['zip'] }],
    });

    if (!filePath) return false;

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(filePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      output.on('close', () => resolve(true));
      archive.on('error', (err: any) => reject(err));

      archive.pipe(output);

      // Add database file
      if (fs.existsSync(this.dbPath)) {
        archive.file(this.dbPath, { name: 'prime.sqlite' });
      }

      // Add images directory
      if (fs.existsSync(this.imagesDir)) {
        archive.directory(this.imagesDir, 'images');
      }

      archive.finalize();
    });
  }

  async importBackup(): Promise<boolean> {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Import Backup',
      filters: [{ name: 'Zip Files', extensions: ['zip'] }],
      properties: ['openFile'],
    });

    if (!filePaths || filePaths.length === 0) return false;

    const backupPath = filePaths[0];

    try {
      // Ensure temp extraction directory exists
      const tempExtractPath = path.join(this.userDataPath, 'temp_restore');
      if (fs.existsSync(tempExtractPath)) {
        fs.rmSync(tempExtractPath, { recursive: true, force: true });
      }
      fs.mkdirSync(tempExtractPath);

      // Extract zip
      await fs
        .createReadStream(backupPath)
        .pipe(unzipper.Extract({ path: tempExtractPath }))
        .promise();

      // Restore DB
      const extractedDbPath = path.join(tempExtractPath, 'prime.sqlite');
      if (fs.existsSync(extractedDbPath)) {
        // Close DB connection if possible?
        // In a real app we might need to close the TypeORM connection first or ensure no locks.
        // For SQLite, replacing the file while app is running might be risky but often works if no active transaction.
        // Ideally we should tell the renderer to block UI and maybe restart app after import.
        fs.copyFileSync(extractedDbPath, this.dbPath);
      }

      // Restore Images
      const extractedImagesDir = path.join(tempExtractPath, 'images');
      if (fs.existsSync(extractedImagesDir)) {
        if (!fs.existsSync(this.imagesDir)) {
          fs.mkdirSync(this.imagesDir);
        }
        // Copy recursive
        fs.cpSync(extractedImagesDir, this.imagesDir, { recursive: true, force: true });
      }

      // Cleanup
      fs.rmSync(tempExtractPath, { recursive: true, force: true });

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}
