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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const firebase_service_1 = require("../firebase/firebase.service");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(firebaseService, jwtService) {
        this.firebaseService = firebaseService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        // Générer un ID SkillBadge basé sur le nom + numéro
        // Exemple: SB-IBRAHIM-001, SB-AMINATA-002
        const skillBadgeId = await this.generateSkillBadgeId(registerDto.fullName);
        // Créer l'utilisateur dans Firestore
        const userData = {
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role,
            fullName: registerDto.fullName,
            skillBadgeId,
            status: registerDto.role === 'formateur' ? 'pending' : 'approved',
        };
        // Ajouter walletAddress seulement si fourni
        if (registerDto.walletAddress) {
            userData.walletAddress = registerDto.walletAddress;
        }
        // Ajouter organisation si c'est un formateur ou recruteur
        if ((registerDto.role === 'formateur' || registerDto.role === 'recruiter') && registerDto.organisation) {
            userData.organisation = registerDto.organisation;
        }
        const userId = await this.firebaseService.create('users', userData);
        const user = await this.firebaseService.findById('users', userId);
        // Générer token JWT
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Retourner token et alias access_token pour compatibilité
        return {
            token,
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                walletAddress: user.walletAddress,
                skillBadgeId: user.skillBadgeId,
            },
        };
    }
    // Générer un ID unique basé sur le nom
    async generateSkillBadgeId(fullName) {
        // Extraire le prénom (premier mot du nom complet)
        const firstName = fullName.trim().split(' ')[0].toUpperCase();
        // Normaliser: enlever les accents et caractères spéciaux
        const normalized = firstName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^A-Z]/g, '');
        // Récupérer tous les utilisateurs et filtrer par prénom
        const allUsers = await this.firebaseService.findAll('users');
        const usersWithSameFirstName = allUsers.filter(u => {
            const userFirstName = u.fullName?.trim().split(' ')[0].toUpperCase();
            return userFirstName === firstName;
        });
        const sequenceNumber = (usersWithSameFirstName.length + 1).toString().padStart(3, '0');
        // Format final: SB-PRENOM-001
        return `SB-${normalized}-${sequenceNumber}`;
    }
    async login(loginDto) {
        console.log('🔐 Tentative de connexion:', loginDto.email);
        // Trouver l'utilisateur dans Firestore
        const users = await this.firebaseService.findByField('users', 'email', loginDto.email);
        console.log('Utilisateurs trouvés:', users.length);
        let userDoc = users[0];
        // Si Google Auth et utilisateur n'existe pas, le créer
        if (!userDoc && loginDto.isGoogleAuth) {
            console.log('🔄 Création automatique via Google Auth');
            const userData = {
                email: loginDto.email,
                fullName: loginDto.email.split('@')[0],
                role: 'talent', // Par défaut
                status: 'approved',
                createdAt: new Date().toISOString()
            };
            const userId = await this.firebaseService.create('users', userData);
            userDoc = { id: userId, ...userData };
        }
        if (!userDoc) {
            console.log('❌ Utilisateur non trouvé');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Ajouter l'ID du document
        const user = {
            id: userDoc.id,
            ...userDoc
        };
        console.log('✅ Utilisateur trouvé, rôle:', user.role);
        // Vérifier si le formateur est approuvé (TOUJOURS, même Google Auth)
        if (user.role === 'formateur' && user.status !== 'approved') {
            throw new common_1.UnauthorizedException('Votre compte n\'a pas encore été approuvé. Veuillez attendre la validation de l\'administrateur.');
        }
        // Vérifier le mot de passe (sauf si Google Auth)
        if (!loginDto.isGoogleAuth) {
            const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
            console.log('Mot de passe correspond:', passwordMatch);
            if (!passwordMatch) {
                console.log('❌ Mot de passe incorrect');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        else {
            console.log('✅ Connexion Google Auth - mot de passe non vérifié');
        }
        // Générer token JWT
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Retourner token et alias access_token pour compatibilité
        return {
            token,
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                walletAddress: user.walletAddress,
                skillBadgeId: user.skillBadgeId, // IMPORTANT: inclure l'ID SkillBadge
            },
        };
    }
    async validateUser(userId) {
        return this.firebaseService.findById('users', userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        jwt_1.JwtService])
], AuthService);

