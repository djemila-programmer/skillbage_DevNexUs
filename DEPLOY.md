# Déploiement sécurisé (ne pas committer de secrets)

Ce document explique comment déployer ce dépôt sur une plateforme publique (Vercel, Render, Heroku, AWS, etc.) sans committer de secrets.

Résumé
- NE COMMITTEZ JAMAIS de fichiers de clés (ex. `apps/backend/*.json`).
- Utilisez les variables d'environnement / secrets fournis par la plateforme d'hébergement.
- Ce projet supporte la lecture de la clé Firebase depuis une variable d'environnement :
  - `FIREBASE_SERVICE_ACCOUNT` (contenu JSON brut)
  - ou `FIREBASE_SERVICE_ACCOUNT_BASE64` (base64 du JSON)
  - ou les variables individuelles : `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

Variables d'environnement requises
- JWT_SECRET — secret pour signer les tokens JWT
- FIREBASE_SERVICE_ACCOUNT ou FIREBASE_SERVICE_ACCOUNT_BASE64 (ou les 3 variables individuelles listées ci-dessus)
- NODE_ENV — production/development
- FRONTEND_URL — URL publique du frontend (optionnel mais utile pour CORS)
- AUTRES — toute API key utilisée par vos services (ex. providers tiers)

Comment préparer la variable FIREBASE_SERVICE_ACCOUNT
1) Récupérer le JSON du compte de service depuis la console Firebase (Service accounts → Generate new private key).
2) Copier le contenu JSON exact dans la variable `FIREBASE_SERVICE_ACCOUNT` sur votre plateforme (valeur brute). Si la plateforme bloque des sauts de ligne, encodez-le en base64 et utilisez `FIREBASE_SERVICE_ACCOUNT_BASE64`.

Exemple (local, pour tests)
1) Créez un fichier `.env.local` (NE PAS committer) :

```
JWT_SECRET=devsecret
FIREBASE_SERVICE_ACCOUNT={...le JSON complet...}
NODE_ENV=development
```

2) Dans votre shell (Windows PowerShell), vous pouvez aussi définir `FIREBASE_SERVICE_ACCOUNT_BASE64` :

```
#$json = Get-Content .\path\to\service-account.json -Raw
#$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
# setx FIREBASE_SERVICE_ACCOUNT_BASE64 $b64
```

Plateformes populaires — notes rapides
- Vercel: Project Settings → Environment Variables. Ajoutez `FIREBASE_SERVICE_ACCOUNT` (ou base64). Configurez variables pour `Preview` et `Production` si nécessaire.
- Render: Dashboard → Environment. Ajoutez la variable, redéployez.
- Heroku: Settings → Config Vars. Ajoutez la variable.
- GitHub Actions: utilisez `secrets.FIREBASE_SERVICE_ACCOUNT` et transmettez-la dans le workflow (voir exemple ci-dessous).

Exemple de workflow GitHub Actions (build & deploy simplifié)

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install
        run: npm ci
      - name: Build
        run: npm run build --if-present
    env:
      FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

Conseils sécurité
- Si une clé a été exposée (push accidentel), révoquez-la immédiatement depuis la console Firebase et générez une nouvelle clé.
- Ne jamais encoder/committer des clés directement dans le repo. Utilisez `.gitignore` pour ignorer `apps/backend/*.json`.

Dépannage local
- Si le backend ne trouve pas la configuration Firebase, vérifiez que `FIREBASE_SERVICE_ACCOUNT` (ou les variables individuelles) sont définies.
- Logs: regardez la sortie du service backend — le démarrage affiche "Firebase Firestore initialisé" quand la connexion fonctionne.

Questions fréquentes
- Pourquoi utiliser base64 ? Certaines interfaces web de variables d'environnement ne gèrent pas correctement les retours à la ligne: base64 contourne ce problème.

---
Si vous voulez, je peux ajouter des exemples spécifiques pour Vercel / Render / Azure App Service ou générer un workflow GitHub Actions complet pour déploiement continu.