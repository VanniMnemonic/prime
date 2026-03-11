"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Location_1 = require("./Location");
const Title_1 = require("./Title");
const Note_1 = require("./Note");
let User = class User {
    id;
    title;
    notes;
    first_name;
    last_name;
    barcode;
    email;
    mobile;
    location_id;
    location;
    image_path;
};
exports.User = User;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Title_1.Title),
    (0, typeorm_1.JoinColumn)({ name: 'title_id' }),
    tslib_1.__metadata("design:type", Title_1.Title)
], User.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.user),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "first_name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "last_name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "barcode", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "mobile", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "location_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Location_1.Location),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    tslib_1.__metadata("design:type", Location_1.Location)
], User.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "image_path", void 0);
exports.User = User = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], User);
