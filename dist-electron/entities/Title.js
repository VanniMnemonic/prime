"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Note_1 = require("./Note");
let Title = class Title {
    id;
    title;
    notes;
};
exports.Title = Title;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Title.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Title.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.title),
    tslib_1.__metadata("design:type", Array)
], Title.prototype, "notes", void 0);
exports.Title = Title = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Title);
