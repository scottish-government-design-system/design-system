"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("./all/all");
const index_1 = __importDefault(require("./base/index"));
const index_2 = __importDefault(require("./components/index"));
const index_3 = __importDefault(require("./forms/index"));
const version_1 = __importDefault(require("./version"));
const DS = {
    base: index_1.default,
    components: index_2.default,
    forms: index_3.default,
    version: version_1.default,
    initAll: all_1.initAll,
    tracking: index_1.default.tools.tracking,
    elementIdModifier: 0
};
exports.default = DS;
;
window.DS = DS;
