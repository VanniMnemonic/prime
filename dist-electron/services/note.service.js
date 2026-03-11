"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const data_source_1 = require("../data-source");
const Note_1 = require("../entities/Note");
class NoteService {
    repository = data_source_1.AppDataSource.getRepository(Note_1.Note);
    async getAll() {
        return this.repository.find({
            relations: ['asset', 'batch', 'location', 'title', 'user', 'withdrawal'],
            order: { created_at: 'DESC' },
        });
    }
    async getByEntity(entityType, entityId) {
        const where = {};
        // Map entityType to the column name in Note entity
        // entityType should be one of: 'asset', 'batch', 'location', 'title', 'user', 'withdrawal'
        where[`${entityType}_id`] = entityId;
        return this.repository.find({
            where,
            order: { created_at: 'DESC' },
        });
    }
    async create(noteData) {
        const note = this.repository.create(noteData);
        return this.repository.save(note);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.NoteService = NoteService;
