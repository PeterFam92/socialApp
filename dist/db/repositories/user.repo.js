"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const database_repository_1 = require("../database.repository");
class userRepository extends database_repository_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.userRepository = userRepository;
