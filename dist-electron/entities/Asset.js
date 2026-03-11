"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Batch_1 = require("./Batch");
const Note_1 = require("./Note");
let Asset = class Asset {
    id;
    denomination;
    batches;
    notes;
    part_number;
    barcode;
    min_stock;
    image_path;
};
exports.Asset = Asset;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Asset.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Asset.prototype, "denomination", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Batch_1.Batch, (batch) => batch.asset),
    tslib_1.__metadata("design:type", Array)
], Asset.prototype, "batches", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.asset),
    tslib_1.__metadata("design:type", Array)
], Asset.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Asset.prototype, "part_number", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Asset.prototype, "barcode", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Asset.prototype, "min_stock", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Asset.prototype, "image_path", void 0);
exports.Asset = Asset = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Asset);
