"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Asset_1 = require("./entities/Asset");
const Batch_1 = require("./entities/Batch");
const Withdrawal_1 = require("./entities/Withdrawal");
const Location_1 = require("./entities/Location");
const Title_1 = require("./entities/Title");
const Note_1 = require("./entities/Note");
const path_1 = tslib_1.__importDefault(require("path"));
const electron_1 = require("electron");
const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'prime.sqlite');
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [User_1.User, Asset_1.Asset, Batch_1.Batch, Withdrawal_1.Withdrawal, Location_1.Location, Title_1.Title, Note_1.Note],
    migrations: [],
    subscribers: [],
});
