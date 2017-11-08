"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const handlers_1 = require("./handlers");
const config = require("./lib/config");
const logger_1 = require("./lib/logger");
// I suck at types.
const Router = require('express-promise-router');
const PORT = process.env.PORT || 4000;
const LOG = logger_1.default('start');
if (config.isLocalDev()) {
    LOG.info(`----- Running in DEV mode -----`);
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        LOG.info('Starting game-recommending-bot');
        const statusHandler = new handlers_1.StatusHandler();
        const app = express();
        // TODO: API Key middleware.
        app.use(bodyParser.urlencoded({
            extended: true,
            limit: '20mb',
        }));
        app.use(bodyParser.json({ limit: '20mb' }));
        // TODO: Pretty error middleware.
        const router = Router();
        // TODO: Make the handlers own the routes.
        router.get('/status', statusHandler.status);
        app.use(router);
        app.listen(PORT, () => {
            LOG.info(`Server started on port ${PORT}.`);
        });
    });
}
start().catch((error) => {
    LOG.error(error);
});
