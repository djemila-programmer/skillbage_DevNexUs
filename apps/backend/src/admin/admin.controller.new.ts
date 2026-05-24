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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const jwt_guard_1 = require("../common/jwt.guard");
let AdminController = class AdminController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    // ===== STATISTIQUES =====
    async getStats() {
        const users = await this.firebaseService.findAll('users');
        const badges = await this.firebaseService.findAll('badges');
        const trainers = users.filter(u => u.role === 'formateur');
        const activeTrainers = trainers.filter(u => u.status === 'approved');
        const pendingApprovals = trainers.filter(u => u.status === 'pending');
        const learners = users.filter(u => u.role === 'talent');
        return {
            totalTrainers: trainers.length,
            activeTrainers: activeTrainers.length,
            totalLearners: learners.length,
            totalBadges: badges.length,
            badgesThisWeek: badges.filter(b => {
                const issuedAt = new Date(b.createdAt);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return issuedAt >= oneWeekAgo;
            }).length,
            pendingApprovals: pendingApprovals.length
        };
    }
    // ===== GESTION DES FORMATEURS =====
    async getTrainers() {
        const users = await this.firebaseService.findAll('users');
        const trainers = users.filter(u => u.role === 'formateur');
        const pending = trainers
            .filter(u => u.status === 'pending')
            .map(u => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            organisation: u.organisation || '',
            experience: u.experience || '',
            skills: u.skills ? u.skills.split(',') : [],
            linkedin: u.linkedin || '',
            status: 'pending',
            submittedAt: u.createdAt,
            justificatifPath: u.justificatifPath || ''
        }));
        const approved = trainers
            .filter(u => u.status === 'approved')
            .map(u => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            organisation: u.organisation || '',
            experience: u.experience || '',
            skills: u.skills ? u.skills.split(',') : [],
            linkedin: u.linkedin || '',
            status: 'approved',
            submittedAt: u.createdAt
        }));
        return { pending, approved };
    }
    async approveTrainer(id) {
        await this.firebaseService.update('users', id, { status: 'approved' });
        return { message: 'Formateur approuvé avec succès' };
    }
    async rejectTrainer(id, body) {
        await this.firebaseService.update('users', id, {
            status: 'rejected',
            rejectionReason: body.reason || ''
        });
        return { message: 'Demande refusée', reason: body.reason };
    }
    async suspendTrainer(id) {
        await this.firebaseService.update('users', id, { status: 'suspended' });
        return { message: 'Formateur suspendu' };
    }
    // ===== GESTION DES BADGES =====
    async getAllBadges() {
        const badges = await this.firebaseService.findAll('badges');
        const users = await this.firebaseService.findAll('users');
        return badges.map(badge => {
            const issuer = users.find(u => u.id === badge.issuerId);
            return {
                id: badge.id,
                name: badge.name,
                domain: badge.domain || badge.category || 'Général',
                level: badge.niveau || badge.level || 'Débutant',
                description: badge.description || '',
                issuer: {
                    fullName: issuer?.fullName || 'Formateur',
                    organisation: issuer?.organisation || ''
                },
                recipientCount: badge.recipientCount || 0,
                status: badge.status || 'active',
                createdAt: badge.createdAt
            };
        });
    }
    async updateBadgeStatus(id, body) {
        await this.firebaseService.update('badges', id, { status: body.status });
        return { message: 'Statut du badge mis à jour' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('trainers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTrainers", null);
__decorate([
    (0, common_1.Post)('trainers/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveTrainer", null);
__decorate([
    (0, common_1.Post)('trainers/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectTrainer", null);
__decorate([
    (0, common_1.Post)('trainers/:id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendTrainer", null);
__decorate([
    (0, common_1.Get)('badges'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBadges", null);
__decorate([
    (0, common_1.Put)('badges/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBadgeStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AdminController);

