"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Asset_1 = require("./Asset");
const Location_1 = require("./Location");
const Note_1 = require("./Note");
let Batch = class Batch {
    id;
    denomination;
    asset_id;
    asset;
    notes;
    location_id;
    location;
    serial_number;
    expiration_date;
    quantity;
    inefficient_quantity;
};
exports.Batch = Batch;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Batch.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Batch.prototype, "denomination", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Batch.prototype, "asset_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Asset_1.Asset, (asset) => asset.batches),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    tslib_1.__metadata("design:type", Asset_1.Asset)
], Batch.prototype, "asset", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.batch),
    tslib_1.__metadata("design:type", Array)
], Batch.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Batch.prototype, "location_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Location_1.Location),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    tslib_1.__metadata("design:type", Location_1.Location)
], Batch.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Batch.prototype, "serial_number", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Batch.prototype, "expiration_date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Batch.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Batch.prototype, "inefficient_quantity", void 0);
exports.Batch = Batch = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Batch);
