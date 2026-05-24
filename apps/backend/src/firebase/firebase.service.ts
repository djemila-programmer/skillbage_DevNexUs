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
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let FirebaseService = class FirebaseService {
    createMemoryId() {
        return `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    }
    getMemoryCollection(name) {
        if (!this.memoryCollections) {
            this.memoryCollections = new Map();
        }
        if (!this.memoryCollections.has(name)) {
            this.memoryCollections.set(name, new Map());
        }
        return this.memoryCollections.get(name);
    }
    applyWhereClause(items, whereClause) {
        if (!whereClause || whereClause.length === 0) {
            return items;
        }
        return whereClause.reduce((acc, clause) => acc.filter(item => {
            const left = item?.[clause.field];
            switch (clause.operator) {
                case '==': return left === clause.value;
                case '!=': return left !== clause.value;
                default: return left === clause.value;
            }
        }), items);
    }
    useMemoryFallback(reason) {
        this.useMemoryStore = true;
        this.memoryCollections = new Map();
        console.warn(`⚠️ Firebase unavailable, using in-memory fallback (${reason})`);
    }
    normalizePrivateKey(privateKey) {
        if (!privateKey) {
            return privateKey;
        }
        let normalized = privateKey.trim();
        // Remove accidental wrapping quotes from .env values or pasted secrets
        if ((normalized.startsWith('"') && normalized.endsWith('"')) || (normalized.startsWith("'") && normalized.endsWith("'"))) {
            normalized = normalized.slice(1, -1);
        }
        // Support both escaped and literal newlines / carriage returns
        normalized = normalized.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
        return normalized;
    }
    onModuleInit() {
        // Initialiser Firebase Admin
        if (!admin.apps.length) {
            // Chemin vers le fichier de clé de service
            const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
            let serviceAccount;

            // 1) If a full service account JSON is provided in env (raw JSON or base64), use it directly
            const envSvc = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
            if (envSvc) {
                try {
                    // Try raw JSON first
                    serviceAccount = JSON.parse(envSvc);
                }
                catch (e) {
                    try {
                        // Try base64-decoded JSON
                        const decoded = Buffer.from(envSvc, 'base64').toString('utf8');
                        serviceAccount = JSON.parse(decoded);
                    }
                    catch (e2) {
                        console.error('Firebase service account provided via env but could not be parsed as JSON');
                        serviceAccount = undefined;
                    }
                }
            }

            // 2) If a file exists next to the bundle, prefer it
            if (!serviceAccount && fs.existsSync(serviceAccountPath)) {
                serviceAccount = require(serviceAccountPath);
            }

            // 3) Fallback to individual env vars (PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY)
            if (!serviceAccount) {
                serviceAccount = {
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: this.normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
                };
            }

            try {
                if (!serviceAccount?.projectId || !serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
                    throw new Error('Missing Firebase service account fields');
                }
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                this.useMemoryStore = false;
            }
            catch (error) {
                this.useMemoryFallback(error?.message || String(error));
            }
        }
        if (!this.useMemoryStore) {
            this.db = admin.firestore();
            console.log('✅ Firebase Firestore initialisé');
        }
        else {
            this.db = null;
            console.log('✅ Firebase mode mémoire initialisé');
        }
    }
    getFirestore() {
        return this.db;
    }
    // Méthodes utilitaires pour les collections
    collection(name) {
        if (this.useMemoryStore) {
            return this.getMemoryCollection(name);
        }
        return this.db.collection(name);
    }
    // Créer un document
    async create(collection, data) {
        if (this.useMemoryStore) {
            const docRef = this.createMemoryId();
            const now = new Date().toISOString();
            this.getMemoryCollection(collection).set(docRef, {
                ...data,
                id: docRef,
                createdAt: now,
                updatedAt: now,
            });
            return docRef;
        }
        const docRef = await this.db.collection(collection).add({
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    }
    // Lire un document
    async findById(collection, id) {
        if (this.useMemoryStore) {
            return this.getMemoryCollection(collection).get(id) || null;
        }
        const doc = await this.db.collection(collection).doc(id).get();
        if (!doc.exists)
            return null;
        return {
            id: doc.id,
            ...doc.data(),
        };
    }
    // Lire tous les documents d'une collection
    async findAll(collection, whereClause) {
        if (this.useMemoryStore) {
            const items = [...this.getMemoryCollection(collection).values()].map(doc => ({ ...doc }));
            return this.applyWhereClause(items, whereClause);
        }
        let query = this.db.collection(collection);
        if (whereClause && whereClause.length > 0) {
            whereClause.forEach(clause => {
                query = query.where(clause.field, clause.operator, clause.value);
            });
        }
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    // Mettre à jour un document
    async update(collection, id, data) {
        if (this.useMemoryStore) {
            const current = this.getMemoryCollection(collection).get(id) || { id };
            const now = new Date().toISOString();
            this.getMemoryCollection(collection).set(id, {
                ...current,
                ...data,
                id,
                createdAt: current.createdAt || now,
                updatedAt: now,
            });
            return;
        }
        await this.db.collection(collection).doc(id).set(data, { merge: true });
    }
    // Supprimer un document
    async delete(collection, id) {
        if (this.useMemoryStore) {
            this.getMemoryCollection(collection).delete(id);
            return;
        }
        await this.db.collection(collection).doc(id).delete();
    }
    // Recherche avec filtre
    async findByField(collection, field, value) {
        if (this.useMemoryStore) {
            const items = [...this.getMemoryCollection(collection).values()].map(doc => ({ ...doc }));
            return items.filter(item => item?.[field] === value);
        }
        const snapshot = await this.db
            .collection(collection)
            .where(field, '==', value)
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    // Recherche textuelle simple (sur un champ spécifique)
    async search(collection, field, searchTerm) {
        if (this.useMemoryStore) {
            const items = [...this.getMemoryCollection(collection).values()].map(doc => ({ ...doc }));
            return items.filter(item => {
                const fieldValue = item[field]?.toLowerCase() || '';
                return fieldValue.includes(searchTerm.toLowerCase());
            });
        }
        // Firestore ne supporte pas la recherche textuelle native
        // On récupère tout et on filtre côté serveur
        const snapshot = await this.db.collection(collection).get();
        return snapshot.docs
            .map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
            .filter(item => {
            const fieldValue = item[field]?.toLowerCase() || '';
            return fieldValue.includes(searchTerm.toLowerCase());
        });
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)()
], FirebaseService);

