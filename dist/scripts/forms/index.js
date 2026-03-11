"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const character_count_1 = __importDefault(require("./character-count/character-count"));
const checkboxes_1 = __importDefault(require("./checkbox/checkboxes"));
exports.default = {
    CharacterCount: character_count_1.default,
    Checkboxes: checkboxes_1.default
};
