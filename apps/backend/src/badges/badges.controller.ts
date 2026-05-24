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
exports.BadgesController = void 0;
const common_1 = require("@nestjs/common");
const badges_service_1 = require("./badges.service");
const badges_dto_1 = require("./badges.dto");
const jwt_guard_1 = require("../common/jwt.guard");
let BadgesController = class BadgesController {
    constructor(badgesService) {
        this.badgesService = badgesService;
    }
    async createBadge(req, createBadgeDto) {
        // Pass the authenticated user so service can validate issuerId overrides
        return this.badgesService.createBadge(req.user, createBadgeDto);
    }
    async getAllBadges() {
        return this.badgesService.getAllBadges();
    }
    async getBadgesByUser(userId) {
        return this.badgesService.getBadgesByUser(userId);
    }
    async verifyBadge(walletAddress) {
        return this.badgesService.verifyBadge(walletAddress);
    }
    async revokeBadge(req, revokeBadgeDto) {
        return this.badgesService.revokeBadge(req.user.sub, revokeBadgeDto);
    }
    // Public endpoint to search talents
    async searchTalents(query, skillBadgeId) {
        // Si un skillBadgeId est fourni, rechercher par cet ID
        if (skillBadgeId) {
            return this.badgesService.searchBySkillBadgeId(skillBadgeId);
        }
        // Sinon rechercher par requête générique
        return this.badgesService.searchTalents(query);
    }
    // Public endpoint to get talent portfolio
    async getTalentPortfolio(userId) {
        return this.badgesService.getTalentPortfolio(userId);
    }
};
exports.BadgesController = BadgesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, badges_dto_1.CreateBadgeDto]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "getAllBadges", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "getBadgesByUser", null);
__decorate([
    (0, common_1.Get)('verify/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "verifyBadge", null);
__decorate([
    (0, common_1.Post)('revoke'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, badges_dto_1.RevokeBadgeDto]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "revokeBadge", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('skillBadgeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "searchTalents", null);
__decorate([
    (0, common_1.Get)('portfolio/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgesController.prototype, "getTalentPortfolio", null);
exports.BadgesController = BadgesController = __decorate([
    (0, common_1.Controller)('badges'),
    __metadata("design:paramtypes", [badges_service_1.BadgesService])
], BadgesController);

