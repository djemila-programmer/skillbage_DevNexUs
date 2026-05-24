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
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor() {
        this.contract = null;
        this.contractABI = [];
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.isInitialized = false;
        this.contractAddress = process.env.CONTRACT_ADDRESS || '';
        this.initializeProvider();
        this.loadContractABI();
    }
    initializeProvider() {
        const rpcUrl = process.env.POLYGON_RPC_URL || 'http://127.0.0.1:8545';
        this.provider = new ethers_1.JsonRpcProvider(rpcUrl);
        this.logger.log(`Initialized blockchain service on network: ${rpcUrl}`);
    }
    loadContractABI() {
        try {
            // Essayer d'abord le chemin local
            const localAbiPath = path.join(__dirname, 'SkillBadgeNFT.json');
            let abiPath = localAbiPath;
            // Si n'existe pas, essayer le chemin vers packages/contracts
            if (!fs.existsSync(abiPath)) {
                abiPath = path.join(__dirname, '../../../packages/contracts/artifacts/contracts/SkillBadgeNFT.sol/SkillBadgeNFT.json');
            }
            if (fs.existsSync(abiPath)) {
                const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                this.contractABI = artifact.abi;
                this.isInitialized = true;
                this.logger.log(`Contract ABI loaded successfully from: ${abiPath}`);
            }
            else {
                this.logger.warn('Contract ABI not found. Using default ABI.');
                // Fallback ABI
                this.contractABI = [
                    'function emettreBadge(address apprenant, string competence, string niveau, string description) public returns (uint256)',
                    'function revoquerBadge(uint256 badgeId) public',
                    'function verifierBadge(uint256 badgeId) public view returns (tuple(uint256 id, address apprenant, address formateur, string competence, string niveau, string description, uint256 timestamp, bool revoque))',
                    'function getBadgesApprenant(address apprenant) public view returns (uint256[])',
                    'function isBadgeValide(uint256 badgeId) public view returns (bool)',
                    'event BadgeEmis(uint256 badgeId, address apprenant, address formateur, string competence, string niveau, uint256 timestamp)',
                    'event BadgeRevoque(uint256 badgeId, address formateur, uint256 timestamp)',
                ];
            }
            if (this.contractAddress && this.isInitialized) {
                this.contract = this.getContractInstance();
                this.logger.log(`Contract initialized at: ${this.contractAddress}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to load contract ABI', error instanceof Error ? error.stack : String(error));
        }
    }
    getContractInstance(wallet) {
        const signer = wallet || this.getWallet();
        return new ethers_1.Contract(this.contractAddress, this.contractABI, signer);
    }
    getWallet() {
        const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf442ff80';
        return new ethers_1.Wallet(privateKey, this.provider);
    }
    async emettreBadge(apprenantAddress, competence, niveau, description) {
        this.logger.log(`Émission de badge pour ${apprenantAddress}...`);
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            const wallet = this.getWallet();
            const contract = this.getContractInstance(wallet);
            // Estimer le gaz
            const gasEstimate = await contract.emettreBadge.estimateGas(apprenantAddress, competence, niveau, description);
            this.logger.log(`Gas estimé: ${gasEstimate.toString()}`);
            // Ajouter 20% de buffer
            const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
            const tx = await contract.emettreBadge(apprenantAddress, competence, niveau, description, { gasLimit });
            this.logger.log(`Transaction envoyée: ${tx.hash}`);
            const receipt = await tx.wait({ timeout: 120000 });
            // Extraire badgeId de l'événement BadgeEmis
            const badgeEmotionEvent = receipt.logs.find((log) => log.fragment && log.fragment.name === 'BadgeEmis');
            let badgeId = '0';
            if (badgeEmotionEvent && badgeEmotionEvent.args) {
                badgeId = badgeEmotionEvent.args.badgeId.toString();
                this.logger.log(`Badge émis avec badgeId: ${badgeId}`);
            }
            return {
                transactionHash: receipt.hash,
                badgeId,
            };
        }
        catch (error) {
            this.logger.error("Échec de l'émission du badge", error.message);
            throw new Error(`Émission de badge échouée: ${error.message}`);
        }
    }
    async revoquerBadge(badgeId) {
        this.logger.log(`Révocation du badge ${badgeId}...`);
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            const wallet = this.getWallet();
            const contract = this.getContractInstance(wallet);
            const tx = await contract.revoquerBadge(badgeId);
            const receipt = await tx.wait({ timeout: 120000 });
            this.logger.log(`Badge ${badgeId} révoqué avec succès`);
            return receipt.hash;
        }
        catch (error) {
            this.logger.error('Échec de la révocation du badge', error.message);
            throw new Error(`Révocation échouée: ${error.message}`);
        }
    }
    async verifierBadge(badgeId) {
        this.logger.log(`Vérification du badge ${badgeId}...`);
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            const contract = this.getContractInstance(this.provider);
            const badge = await contract.verifierBadge(badgeId);
            return {
                id: badge.id.toString(),
                apprenant: badge.apprenant,
                formateur: badge.formateur,
                competence: badge.competence,
                niveau: badge.niveau,
                description: badge.description,
                timestamp: new Date(Number(badge.timestamp) * 1000),
                revoque: badge.revoque,
            };
        }
        catch (error) {
            this.logger.error('Échec de la vérification', error.message);
            throw new Error(`Vérification échouée: ${error.message}`);
        }
    }
    async getBadgesApprenant(apprenantAddress) {
        this.logger.log(`Récupération des badges pour ${apprenantAddress}...`);
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            const contract = this.getContractInstance(this.provider);
            const badgeIds = await contract.getBadgesApprenant(apprenantAddress);
            this.logger.log(`${badgeIds.length} badges trouvés`);
            return badgeIds.map((id) => id.toString());
        }
        catch (error) {
            this.logger.error('Échec de la récupération des badges', error.message);
            throw new Error(`Récupération échouée: ${error.message}`);
        }
    }
    async isBadgeValide(badgeId) {
        this.logger.log(`Vérification validité badge ${badgeId}...`);
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            const contract = this.getContractInstance(this.provider);
            const valide = await contract.isBadgeValide(badgeId);
            return valide;
        }
        catch (error) {
            this.logger.error('Échec vérification validité', error.message);
            return false;
        }
    }
    createBadgeMetadata(badge) {
        return {
            name: badge.name,
            description: badge.description,
            competence: badge.competence,
            niveau: badge.niveau,
            issuer: badge.issuer,
            recipient: badge.recipient,
            date: badge.date.toISOString(),
            attributes: [
                {
                    trait_type: 'Niveau',
                    value: badge.niveau,
                },
                {
                    trait_type: 'Compétence',
                    value: badge.competence,
                },
            ],
        };
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);

