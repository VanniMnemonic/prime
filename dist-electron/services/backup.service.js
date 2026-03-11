"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const archiver_1 = tslib_1.__importDefault(require("archiver"));
const unzipper_1 = tslib_1.__importDefault(require("unzipper"));
class BackupService {
    userDataPath = electron_1.app.getPath('userData');
    dbPath = path.join(this.userDataPath, 'prime.sqlite');
    imagesDir = path.join(this.userDataPath, 'images');
    async exportBackup() {
        const { filePath } = await electron_1.dialog.showSaveDialog({
            title: 'Export Backup',
            defaultPath: `prime-backup-${new Date().toISOString().split('T')[0]}.zip`,
            filters: [{ name: 'Zip Files', extensions: ['zip'] }],
        });
        if (!filePath)
            return false;
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(filePath);
            const archive = (0, archiver_1.default)('zip', {
                zlib: { level: 9 },
            });
            output.on('close', () => resolve(true));
            archive.on('error', (err) => reject(err));
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
    async importBackup() {
        const { filePaths } = await electron_1.dialog.showOpenDialog({
            title: 'Import Backup',
            filters: [{ name: 'Zip Files', extensions: ['zip'] }],
            properties: ['openFile'],
        });
        if (!filePaths || filePaths.length === 0)
            return false;
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
                .pipe(unzipper_1.default.Extract({ path: tempExtractPath }))
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
        }
        catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    }
}
exports.BackupService = BackupService;
