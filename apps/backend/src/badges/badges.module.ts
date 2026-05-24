// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const badges_service_1 = require("./badges.service");
const badges_controller_1 = require("./badges.controller");
const blockchain_module_1 = require("../blockchain/blockchain.module");
let BadgesModule = class BadgesModule {
};
exports.BadgesModule = BadgesModule;
exports.BadgesModule = BadgesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            blockchain_module_1.BlockchainModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        providers: [badges_service_1.BadgesService],
        controllers: [badges_controller_1.BadgesController],
    })
], BadgesModule);

