// @ts-nocheck
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '.env' });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // SÉCURITÉ: Helmet pour les en-têtes HTTP sécurisés
    app.use((0, helmet_1.default)());
    // SÉCURITÉ: Rate Limiting pour éviter les attaques brute force
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: parseInt(process.env.RATE_LIMIT_TTL) * 1000 || 60000, // 1 minute
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // max 100 requêtes par minute
        message: {
            error: 'Too many requests',
            message: 'Vous avez dépassé le nombre de requêtes autorisées. Réessayez dans 1 minute.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    // SÉCURITÉ: CORS restreint
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: [frontendUrl, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 3600, // Cache CORS pendant 1 heure
    });
    // Validation des données
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // Supprime les champs non autorisés
        forbidNonWhitelisted: true, // Rejette les champs inattendus
        transform: true, // Transforme les types automatiquement
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🔒 SkillBadge API running on port ${port}`);
    console.log(`🛡️ Security: Helmet + Rate Limiting + CORS Restreint`);
}
bootstrap();

