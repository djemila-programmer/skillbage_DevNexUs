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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const firebase_service_1 = require("../firebase/firebase.service");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let BadgesService = class BadgesService {
    constructor(firebaseService, blockchainService) {
        this.firebaseService = firebaseService;
        this.blockchainService = blockchainService;
    }
    // Convertir les timestamps Firestore en dates lisibles
    convertTimestamp(timestamp) {
        if (!timestamp)
            return new Date().toISOString();
        // Si c'est un objet Firestore Timestamp
        if (timestamp._seconds) {
            return new Date(timestamp._seconds * 1000).toISOString();
        }
        // Si c'est déjà une string
        if (typeof timestamp === 'string') {
            return timestamp;
        }
        // Si c'est un objet Date
        if (timestamp instanceof Date) {
            return timestamp.toISOString();
        }
        return new Date().toISOString();
    }
    // Convertir tous les badges
    convertBadgesDates(badges) {
        return badges.map(badge => ({
            ...badge,
            issuedAt: this.convertTimestamp(badge.issuedAt),
            createdAt: this.convertTimestamp(badge.createdAt),
            updatedAt: this.convertTimestamp(badge.updatedAt),
        }));
    }
    async getAllBadges() {
        const allBadges = await this.firebaseService.findAll('badges');
        return this.convertBadgesDates(allBadges);
    }
    async updateUserStatus(userId, status) {
        await this.firebaseService.update('users', userId, { status });
        return { success: true, userId, status };
    }
    async searchTalents(query) {
        const allUsers = await this.firebaseService.findAll('users', [
            { field: 'role', operator: '==', value: 'talent' }
        ]);
        const talents = allUsers.filter(user => user.fullName?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()));
        const talentsWithBadges = await Promise.all(talents.map(async (talent) => {
            const badges = await this.firebaseService.findByField('badges', 'recipientId', talent.id);
            return {
                id: talent.id,
                fullName: talent.fullName,
                email: talent.email,
                walletAddress: talent.walletAddress,
                isVerified: talent.isVerified,
                createdAt: this.convertTimestamp(talent.createdAt),
                badgeCount: badges.length,
                badges: this.convertBadgesDates(badges).map((badge) => ({
                    id: badge.id,
                    name: badge.name,
                    skills: badge.skills,
                    issuedAt: badge.issuedAt,
                    issuer: badge.issuerName,
                })),
            };
        }));
        return talentsWithBadges;
    }
    async searchBySkillBadgeId(skillBadgeId) {
        const allUsers = await this.firebaseService.findAll('users', [
            { field: 'role', operator: '==', value: 'talent' }
        ]);
        const talent = allUsers.find(user => user.skillBadgeId === skillBadgeId.toUpperCase());
        if (!talent) {
            return [];
        }
        const badges = await this.firebaseService.findByField('badges', 'recipientId', talent.id);
        return [{
                id: talent.id,
                fullName: talent.fullName,
                email: talent.email,
                skillBadgeId: talent.skillBadgeId,
                walletAddress: talent.walletAddress,
                isVerified: talent.isVerified,
                createdAt: this.convertTimestamp(talent.createdAt),
                badgeCount: badges.length,
                badges: this.convertBadgesDates(badges).map((badge) => ({
                    id: badge.id,
                    name: badge.name,
                    skills: badge.skills,
                    issuedAt: badge.issuedAt,
                    issuer: badge.issuerName,
                })),
            }];
    }
    async getTalentPortfolio(userId) {
        const talent = await this.firebaseService.findById('users', userId);
        if (!talent || talent.role !== 'talent') {
            throw new common_1.NotFoundException('Talent not found');
        }
        if (talent.portfolioIsPublic === false) {
            throw new common_1.ForbiddenException('Portfolio is private');
        }
        const badges = await this.firebaseService.findByField('badges', 'recipientId', userId);
        return {
            id: talent.id,
            fullName: talent.fullName,
            email: talent.email,
            walletAddress: talent.walletAddress,
            isVerified: talent.isVerified,
            createdAt: this.convertTimestamp(talent.createdAt),
            photoUrl: talent.photoUrl,
            githubUrl: talent.githubUrl,
            linkedin: talent.linkedin,
            portfolioIsPublic: talent.portfolioIsPublic,
            customPortfolioUrl: talent.customPortfolioUrl,
            objective: talent.objective,
            level: talent.level,
            badgeCount: badges.length,
            badges: this.convertBadgesDates(badges).map((badge) => ({
                id: badge.id,
                name: badge.name,
                description: badge.description,
                skills: badge.skills,
                niveau: badge.niveau,
                issuedAt: badge.issuedAt,
                issuer: {
                    fullName: badge.issuerName,
                    organisation: badge.issuerOrganisation
                },
                transactionHash: badge.transactionHash,
                tokenId: badge.tokenId,
            })),
        };
    }
    async createBadge(user, createBadgeDto) {
        // Determine effective issuer: payload may include issuerId (allowed only for admin or self)
        let effectiveIssuerId = user.id;
        if (createBadgeDto.issuerId) {
            // If user is admin, allow setting issuerId to another user
            if (user.role === 'admin') {
                effectiveIssuerId = createBadgeDto.issuerId;
            }
            else if (createBadgeDto.issuerId === user.id) {
                effectiveIssuerId = user.id;
            }
            else {
                throw new common_1.ForbiddenException('Cannot set issuerId');
            }
        }
        const issuer = await this.firebaseService.findById('users', effectiveIssuerId);
        if (!issuer) {
            throw new common_1.NotFoundException('User not found');
        }
        if (issuer.role !== 'formateur') {
            throw new common_1.ForbiddenException('Only formateurs can issue badges');
        }
        // Vérifier si c'est un TEMPLATE (type de badge) ou une ATTRIBUTION
        if (createBadgeDto.isTemplate) {
            // CRÉER UN TYPE DE BADGE (template)
            const badgeId = await this.firebaseService.create('badges', {
                name: createBadgeDto.name,
                description: createBadgeDto.description || '',
                domaine: createBadgeDto.domaine || '',
                skills: createBadgeDto.skills || [],
                criteres: createBadgeDto.criteres || {},
                issuerId: issuer.id,
                issuerName: issuer.fullName,
                issuerOrganisation: issuer.organisation || '',
                isTemplate: true,
                status: 'active',
                recipientsCount: 0,
            });
            return this.firebaseService.findById('badges', badgeId);
        }
        // ATTRIBUTION D'UN BADGE À UN TALENT
        const recipient = await this.firebaseService.findById('users', createBadgeDto.recipientId);
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        if (recipient.role !== 'talent') {
            throw new common_1.ForbiddenException('Can only issue badges to talents');
        }
        let metadataURI = '';
        let transactionHash = '';
        let tokenId = '';
        try {
            const blockchainResult = await this.blockchainService.emettreBadge(recipient.walletAddress || '0x0000000000000000000000000000000000000000', createBadgeDto.name, createBadgeDto.niveau || 'intermediaire', createBadgeDto.description || '');
            transactionHash = blockchainResult.transactionHash;
            tokenId = blockchainResult.badgeId;
            metadataURI = `badge-${tokenId}`;
        }
        catch (error) {
            console.log('Blockchain operations skipped, badge will be stored in Firestore only');
            metadataURI = `local-badge-${Date.now()}`;
        }
        const badgeId = await this.firebaseService.create('badges', {
            name: createBadgeDto.name,
            description: createBadgeDto.description || '',
            niveau: createBadgeDto.niveau || 'intermediaire',
            note: createBadgeDto.note || '',
            skills: Array.isArray(createBadgeDto.skills) ? createBadgeDto.skills.join(',') : createBadgeDto.skills || '',
            issuerId: issuer.id,
            issuerName: issuer.fullName,
            issuerOrganisation: issuer.organisation || '',
            recipientId: recipient.id,
            recipientName: recipient.fullName,
            metadataURI,
            transactionHash,
            tokenId,
            isTemplate: false,
            status: 'active',
            issuedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return this.firebaseService.findById('badges', badgeId);
    }
    async getBadgesByUser(userId) {
        const allBadges = await this.firebaseService.findAll('badges');
        const userBadges = allBadges.filter(badge => badge.issuerId === userId || badge.recipientId === userId);
        return this.convertBadgesDates(userBadges);
    }
    async revokeBadge(issuerId, revokeBadgeDto) {
        const badge = await this.firebaseService.findById('badges', revokeBadgeDto.badgeId);
        if (!badge) {
            throw new common_1.NotFoundException('Badge not found');
        }
        if (badge.issuerId !== issuerId) {
            throw new common_1.ForbiddenException('Only the issuer can revoke this badge');
        }
        try {
            await this.blockchainService.revoquerBadge(badge.tokenId);
        }
        catch (error) {
            console.log('Blockchain revoke failed');
        }
        await this.firebaseService.update('badges', badge.id, { status: 'revoked' });
        return this.firebaseService.findById('badges', badge.id);
    }
    async verifyBadge(walletAddress) {
        const badges = await this.blockchainService.getBadgesApprenant(walletAddress);
        return badges;
    }
};
exports.BadgesService = BadgesService;
exports.BadgesService = BadgesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        blockchain_service_1.BlockchainService])
], BadgesService);

