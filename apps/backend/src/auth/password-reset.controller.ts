// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetController = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let PasswordResetController = class PasswordResetController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async resetPassword(body) {
        try {
            const { email } = body;
            if (!email) {
                throw new common_1.HttpException('Email requis', common_1.HttpStatus.BAD_REQUEST);
            }
            // Utiliser Firebase Admin SDK pour envoyer l'email
            const admin = require('firebase-admin');
            try {
                await admin.auth().generatePasswordResetLink(email);
                return {
                    success: true,
                    message: 'Email de réinitialisation envoyé'
                };
            }
            catch (err) {
                if (err.code === 'auth/user-not-found') {
                    throw new common_1.HttpException('Aucun compte trouvé avec cet email', common_1.HttpStatus.NOT_FOUND);
                }
                throw new common_1.HttpException('Erreur lors de l\'envoi', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erreur serveur', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PasswordResetController = PasswordResetController;
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasswordResetController.prototype, "resetPassword", null);
exports.PasswordResetController = PasswordResetController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], PasswordResetController);

