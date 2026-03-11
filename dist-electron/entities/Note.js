"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Asset_1 = require("./Asset");
const Batch_1 = require("./Batch");
const Location_1 = require("./Location");
const Title_1 = require("./Title");
const User_1 = require("./User");
const Withdrawal_1 = require("./Withdrawal");
let Note = class Note {
    id;
    content;
    created_at;
    asset_id;
    asset;
    batch_id;
    batch;
    location_id;
    location;
    title_id;
    title;
    user_id;
    user;
    withdrawal_id;
    withdrawal;
};
exports.Note = Note;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], Note.prototype, "content", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Note.prototype, "created_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "asset_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Asset_1.Asset, (asset) => asset.notes),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    tslib_1.__metadata("design:type", Asset_1.Asset)
], Note.prototype, "asset", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "batch_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Batch_1.Batch, (batch) => batch.notes),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    tslib_1.__metadata("design:type", Batch_1.Batch)
], Note.prototype, "batch", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "location_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Location_1.Location, (location) => location.notes),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    tslib_1.__metadata("design:type", Location_1.Location)
], Note.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "title_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Title_1.Title, (title) => title.notes),
    (0, typeorm_1.JoinColumn)({ name: 'title_id' }),
    tslib_1.__metadata("design:type", Title_1.Title)
], Note.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.notes),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", User_1.User)
], Note.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Note.prototype, "withdrawal_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Withdrawal_1.Withdrawal, (withdrawal) => withdrawal.notes),
    (0, typeorm_1.JoinColumn)({ name: 'withdrawal_id' }),
    tslib_1.__metadata("design:type", Withdrawal_1.Withdrawal)
], Note.prototype, "withdrawal", void 0);
exports.Note = Note = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Note);
