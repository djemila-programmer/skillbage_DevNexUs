'use client'

import { useParams } from 'next/navigation'
import { Shield, Calendar, Award, Globe, ExternalLink, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BadgeDetail() {
  const params = useParams()
  const badgeId = params.id

  // Données simulées (à remplacer par un appel API)
  const badge = {
    id: badgeId,
    name: 'Intermédiaire en Flutter/Dart',
    category: 'DÉVELOPPEMENT MOBILE',
    level: 'Intermédiaire',
    score: 85,
    issuedDate: '12 Mars 2024',
    issuer: 'Académie Savane Tech',
    issuerAddress: '0x742d35Cc6634C0532925a3b844Bc9595f42bE2',
    recipient: 'Archad Ouédraogo',
    recipientAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    blockchainProof: '0x5c7a9b3e4f1d2c8a6b5e4d3c2b1a9f8e7d6c5b4a3',
    tokenId: '12345',
    description: 'Ce badge certifie que le détenteur possède une compréhension solide des concepts fondamentaux de Flutter/Dart, ainsi qu\'une capacité à les appliquer efficacement dans le développement d\'applications mobiles.',
    skills: ['Flutter', 'Dart', 'UI Design', 'State Management'],
    status: 'active' as const,
    ipfsHash: 'QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K',
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header avec navigation */}
      <div className="mb-8">
        <Link 
          href="/dashboard/badges"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#AB3500] transition mb-4"
        >
          ← Retour à la liste des badges
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Détails du Badge
        </h1>
        <p className="text-sm text-gray-600">
          Informations de certification vérifiées sur la blockchain Polygon.
        </p>
      </div>

      {/* Badge principal */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Icône du badge */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center relative">
              <Award className="w-16 h-16 text-[#AB3500]" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-[#AB3500] uppercase tracking-wider mb-1">
                  {badge.category}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {badge.name}
                </h2>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {badge.level}
                </span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                badge.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {badge.status === 'active' ? '● ACTIF' : '○ RÉVOQUÉ'}
              </span>
            </div>

            {/* Résultat d'évaluation */}
            <div className="bg-orange-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#AB3500] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Résultat de l'évaluation</p>
                  <p className="text-lg font-bold text-gray-900">
                    A réussi l'examen avec {badge.score}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Pourquoi ce badge a été délivré ?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {badge.description}
        </p>
      </div>

      {/* Compétences */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Compétences validées
        </h3>
        <div className="flex flex-wrap gap-2">
          {(badge.skills as string[]).map((skill: string, index: number) => (
            <span 
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Métadonnées */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
          Métadonnées de certification
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              DATE D'ÉMISSION
            </p>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{badge.issuedDate}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              ÉMETTEUR
            </p>
            <div>
              <p className="font-semibold text-gray-900">{badge.issuer}</p>
              <p className="text-xs text-gray-500 font-mono">{badge.issuerAddress}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              TITULAIRE
            </p>
            <div>
              <p className="font-semibold text-gray-900">{badge.recipient}</p>
              <p className="text-xs text-gray-500 font-mono">{badge.recipientAddress}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              TYPE DE PREUVE
            </p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-900">Blockchain Polygon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations Blockchain */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Preuve Blockchain
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Token ID (NFT Soulbound)
            </p>
            <p className="font-mono text-sm text-gray-900 bg-white px-4 py-2 rounded-lg">
              {badge.tokenId}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Transaction Hash
            </p>
            <p className="font-mono text-xs text-gray-900 bg-white px-4 py-2 rounded-lg break-all">
              {badge.blockchainProof}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              IPFS Metadata Hash
            </p>
            <p className="font-mono text-xs text-gray-900 bg-white px-4 py-2 rounded-lg break-all">
              {badge.ipfsHash}
            </p>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a 
          href={`https://polygonscan.com/tx/${badge.blockchainProof}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-4 bg-[#AB3500] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-900 transition shadow-lg"
        >
          <ExternalLink className="w-5 h-5" />
          Vérifier sur Polygonscan
        </a>
        
        <button className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager le badge
        </button>
      </div>

      {/* Note informative */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ Information :</strong> Ce badge est un NFT Soulbound (non transférable) enregistré sur la blockchain Polygon. 
          Il ne peut pas être modifié ou supprimé, seulement révoqué par l'émetteur d'origine.
        </p>
      </div>
    </div>
  )
}
