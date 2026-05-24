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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
let FirebaseAuthService = class FirebaseAuthService {
    onModuleInit() {
        if (admin.apps.length > 0) {
            this.auth = admin.auth();
            console.log('✅ Firebase Auth initialisé');
        }
        else {
            this.auth = null;
            console.warn('⚠️ Firebase Auth indisponible (mode sans app Firebase)');
        }
    }
    // Créer un utilisateur avec email/password
    async createUser(email, password, displayName) {
        if (!this.auth) {
            return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
        }
        const userRecord = await this.auth.createUser({
            email,
            password,
            displayName,
        });
        return userRecord.uid;
    }
    // Vérifier le token Firebase
    async verifyToken(token) {
        if (!this.auth) {
            throw new common_1.UnauthorizedException('Firebase Auth unavailable in local fallback mode');
        }
        return this.auth.verifyIdToken(token);
    }
    // Trouver un utilisateur par email
    async getUserByEmail(email) {
        if (!this.auth) {
            throw new common_1.NotFoundException('Firebase Auth unavailable in local fallback mode');
        }
        return this.auth.getUserByEmail(email);
    }
    // Trouver un utilisateur par UID
    async getUser(uid) {
        if (!this.auth) {
            throw new common_1.NotFoundException('Firebase Auth unavailable in local fallback mode');
        }
        return this.auth.getUser(uid);
    }
    // Mettre à jour le mot de passe
    async updatePassword(uid, newPassword) {
        if (!this.auth) {
            return;
        }
        await this.auth.updateUser(uid, { password: newPassword });
    }
    // Supprimer un utilisateur
    async deleteUser(uid) {
        if (!this.auth) {
            return;
        }
        await this.auth.deleteUser(uid);
    }
};
exports.FirebaseAuthService = FirebaseAuthService;
exports.FirebaseAuthService = FirebaseAuthService = __decorate([
    (0, common_1.Injectable)()
], FirebaseAuthService);

