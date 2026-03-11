"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Batch_1 = require("./Batch");
const Note_1 = require("./Note");
let Withdrawal = class Withdrawal {
    id;
    date;
    notes;
    quantity;
    user_id;
    user;
    batch_id;
    batch;
    must_return;
    expected_return_date;
    returned_quantity;
    return_date;
    inefficient_quantity;
};
exports.Withdrawal = Withdrawal;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Withdrawal.prototype, "date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.withdrawal),
    tslib_1.__metadata("design:type", Array)
], Withdrawal.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", User_1.User)
], Withdrawal.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "batch_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Batch_1.Batch),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    tslib_1.__metadata("design:type", Batch_1.Batch)
], Withdrawal.prototype, "batch", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Withdrawal.prototype, "must_return", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Withdrawal.prototype, "expected_return_date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "returned_quantity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Withdrawal.prototype, "return_date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Withdrawal.prototype, "inefficient_quantity", void 0);
exports.Withdrawal = Withdrawal = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Withdrawal);
