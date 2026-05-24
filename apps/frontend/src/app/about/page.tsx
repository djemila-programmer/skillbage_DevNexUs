'use client'

import { ArrowRight, Users, Briefcase, Shield, Check, Award, TrendingUp, Code, Lock, Database, Cloud, Palette, Rocket, Share2, Quote, Menu, X, Globe } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [showLangDropdown, setShowLangDropdown] = useState(false)

  const toggleLang = (newLang: 'fr' | 'en') => {
    setLang(newLang)
    setShowLangDropdown(false)
  }

  const t = {
    fr: {
      home: 'Accueil',
      about: 'À propos',
      verification: 'Vérification',
      login: 'Connexion',
      register: 'Inscription',
      hero_badge: "Certification d'État Blockchain",
      hero_title: 'Propulsez votre carrière avec une preuve de talent.',
      hero_subtitle: 'La plateforme nationale pour certifier vos compétences tech sur la blockchain et booster votre employabilité.',
      create_portfolio: 'Créer mon portfolio',
      join_formateur: 'Rejoindre en tant que formateur',
      verify_talent: 'Vérifier un talent',
      brand_subtitle: 'Badges Numériques Certifiés sur la Blockchain',
      challenge_title: 'Le Défi du Capital Humain',
      challenge_subtitle: 'Le paradoxe numérique du Burkina Faso : une formation massive mais une employabilité limitée par le manque de confiance.',
      stats_graduates: '15 000+',
      stats_graduates_label: 'Jeunes formés / an',
      stats_graduates_desc: 'Une réserve de talent dynamique mais dépourvue de certifications standardisées.',
      stats_unemployed: 'Moins de 5%',
      stats_unemployed_label: 'Certifiés reconnus',
      stats_unemployed_desc: 'La grande majorité des acquis restent informels et invisibles pour le marché.',
      stats_verified: '70%',
      stats_verified_label: 'Recruteurs en difficulté',
      stats_verified_desc: 'Les entreprises peinent à valider l\'authenticité des compétences déclarées.',
      challenge_conclusion: 'SkillBadge comble le fossé entre la formation théorique et les exigences du marché de l\'emploi numérique.',
      about_title: 'SkillBadge',
      about_subtitle: 'Badges Numériques Certifiés sur la Blockchain',
      about_mission_title: 'Notre Mission',
      about_mission_desc: 'SkillBadge révolutionne la certification des compétences numériques au Burkina Faso en utilisant la technologie blockchain pour créer des badges non falsifiables. Notre plateforme permet aux talents de prouver leurs compétences et aux recruteurs de les vérifier instantanément.',
      about_vision_title: 'Notre Vision',
      about_vision_desc: 'Devenir la référence nationale en matière de certification numérique, permettant à chaque diplômé de valoriser ses compétences sur le marché de l\'emploi local et international.',
      about_blockchain_title: 'Pourquoi Blockchain ?',
      about_blockchain_desc: 'La blockchain garantit l\'immuabilité et la traçabilité de chaque badge. Une fois émis, un badge ne peut être ni modifié ni supprimé, assurant une confiance totale pour les recruteurs et les talents.',
      ecosystem_title: 'L\'Écosystème de Confiance SkillBadge',
      ecosystem_talent_title: 'Talent',
      ecosystem_talent_desc: 'Obtenez des badges vérifiables et partagez votre portfolio avec les recruteurs du monde entier.',
      ecosystem_formateur_title: 'Formateur',
      ecosystem_formateur_desc: 'Émettez des certifications reconnues et suivez la progression de vos étudiants.',
      ecosystem_recruiter_title: 'Recruteur',
      ecosystem_recruiter_desc: 'Vérifiez instantanément l\'authenticité des compétences claimées par les candidats.',
      ecosystem_blockchain_title: 'Blockchain',
      ecosystem_blockchain_desc: 'Infrastructure décentralisée garantissant la sécurité et l\'immuabilité des certifications.',
      features_title: 'Fonctionnalités Clés',
      feature_soulbound_title: 'NFT Soulbound',
      feature_soulbound_desc: 'Badges non transférables liés à votre wallet, impossibles à vendre ou échanger.',
      feature_ipfs_title: 'Stockage IPFS',
      feature_ipfs_desc: 'Métadonnées décentralisées stockées sur IPFS pour une résilience maximale.',
      feature_verify_title: 'Vérification Instantanée',
      feature_verify_desc: 'QR Code et lien public pour partager et vérifier vos certifications en un clic.',
      testimonials_title: 'Ils ont franchi le pas',
      testimonial_1_name: 'SAWADODO',
      testimonial_1_role: 'Développeur Fullstack',
      testimonial_1_text: 'Grâce à mon badge SkillBadge, j\'ai pu décrocher un contrat en freelance avec une agence à Lyon sans avoir de diplôme classique.',
      testimonial_2_name: 'Archad',
      testimonial_2_role: 'Designer UI/UX',
      testimonial_2_text: 'Le processus de certification est rigoureux. Ça donne une vraie valeur à notre travail quotidien.',
      testimonial_3_name: 'Achille',
      testimonial_3_role: 'Consultant Data',
      testimonial_3_text: 'Enfin une plateforme qui comprend que la compétence prime sur le bout de papier.',
      testimonial_4_name: 'Toussiane',
      testimonial_4_role: 'Designer UI/UX, Certified',
      testimonial_4_text: 'Grâce au SkillBadge UI/UX, j\'ai pu prouver mes compétences à une agence tech à Ouagadougou. J\'ai été embauché en moins de deux semaines.',
      cta_title: 'Prêt à valider votre héritage ?',
      cta_subtitle: 'Rejoignez la communauté SkillBadge et valorisez vos compétences dès aujourd\'hui.',
      cta_button: 'Commencer maintenant',
      footer_legal: 'LÉGAL',
      footer_privacy: 'Confidentialité',
      footer_terms: 'Conditions',
      footer_contact: 'CONTACT',
      footer_email: 'contact@skillbadge.bf',
      footer_phone: '+226 XX XX XX XX',
      footer_copyright: '© 2026 SKILLBADGE BURKINA FASO. OFFICIAL CERTIFICATION AUTHORITY.',
    },
    en: {
      home: 'Home',
      about: 'About',
      verification: 'Verification',
      login: 'Login',
      register: 'Register',
      hero_badge: 'State Blockchain Certification',
      hero_title: 'Boost your career with proof of talent.',
      hero_subtitle: 'The national platform to certify your tech skills on the blockchain and boost your employability.',
      create_portfolio: 'Create my portfolio',
      join_formateur: 'Join as a trainer',
      verify_talent: 'Verify a talent',
      brand_subtitle: 'Digital Badges Certified on Blockchain',
      challenge_title: 'The Human Capital Challenge',
      challenge_subtitle: 'The digital paradox of Burkina Faso: massive training but limited employability due to lack of trust.',
      stats_graduates: '15,000+',
      stats_graduates_label: 'Youth trained / year',
      stats_graduates_desc: 'A dynamic talent pool but lacking standardized certifications.',
      stats_unemployed: 'Less than 5%',
      stats_unemployed_label: 'Recognized certified',
      stats_unemployed_desc: 'The vast majority of skills remain informal and invisible to the market.',
      stats_verified: '70%',
      stats_verified_label: 'Recruiters struggling',
      stats_verified_desc: 'Companies struggle to validate the authenticity of declared skills.',
      challenge_conclusion: 'SkillBadge bridges the gap between theoretical training and digital job market requirements.',
      about_title: 'SkillBadge',
      about_subtitle: 'Digital Badges Certified on Blockchain',
      about_mission_title: 'Our Mission',
      about_mission_desc: 'SkillBadge revolutionizes digital skills certification in Burkina Faso using blockchain technology to create unfalsifiable badges. Our platform allows talents to prove their skills and recruiters to verify them instantly.',
      about_vision_title: 'Our Vision',
      about_vision_desc: 'To become the national reference for digital certification, allowing every graduate to showcase their skills in the local and international job market.',
      about_blockchain_title: 'Why Blockchain?',
      about_blockchain_desc: 'Blockchain ensures the immutability and traceability of each badge. Once issued, a badge cannot be modified or deleted, ensuring total trust for recruiters and talents.',
      ecosystem_title: 'The SkillBadge Trust Ecosystem',
      ecosystem_talent_title: 'Talent',
      ecosystem_talent_desc: 'Get verifiable badges and share your portfolio with recruiters worldwide.',
      ecosystem_formateur_title: 'Trainer',
      ecosystem_formateur_desc: 'Issue recognized certifications and track your students\' progress.',
      ecosystem_recruiter_title: 'Recruiter',
      ecosystem_recruiter_desc: 'Instantly verify the authenticity of skills claimed by candidates.',
      ecosystem_blockchain_title: 'Blockchain',
      ecosystem_blockchain_desc: 'Decentralized infrastructure ensuring security and immutability of certifications.',
      features_title: 'Key Features',
      feature_soulbound_title: 'Soulbound NFT',
      feature_soulbound_desc: 'Non-transferable badges linked to your wallet, impossible to sell or exchange.',
      feature_ipfs_title: 'IPFS Storage',
      feature_ipfs_desc: 'Decentralized metadata stored on IPFS for maximum resilience.',
      feature_verify_title: 'Instant Verification',
      feature_verify_desc: 'QR Code and public link to share and verify your certifications in one click.',
      testimonials_title: 'They took the leap',
      testimonial_1_name: 'SAWADODO',
      testimonial_1_role: 'Fullstack Developer',
      testimonial_1_text: 'Thanks to my SkillBadge, I was able to get a freelance contract with an agency in Lyon without having a traditional degree.',
      testimonial_2_name: 'Archad',
      testimonial_2_role: 'UI/UX Designer',
      testimonial_2_text: 'The certification process is rigorous. It gives real value to our daily work.',
      testimonial_3_name: 'Achille',
      testimonial_3_role: 'Data Consultant',
      testimonial_3_text: 'Finally a platform that understands that skills matter more than a piece of paper.',
      testimonial_4_name: 'Toussiane',
      testimonial_4_role: 'UI/UX Designer, Certified',
      testimonial_4_text: 'Thanks to the SkillBadge UI/UX, I was able to prove my skills to a tech agency in Ouagadougou. I was hired in less than two weeks.',
      cta_title: 'Ready to validate your legacy?',
      cta_subtitle: 'Join the SkillBadge community and showcase your skills today.',
      cta_button: 'Get started now',
      footer_legal: 'LEGAL',
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      footer_contact: 'CONTACT',
      footer_email: 'contact@skillbadge.bf',
      footer_phone: '+226 XX XX XX XX',
      footer_copyright: '© 2026 SKILLBADGE BURKINA FASO. OFFICIAL CERTIFICATION AUTHORITY.',
    }
  }

  const content = t[lang]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wider">SKILLBADGE BURKINA FASO</span>
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 hover:text-orange-400 transition"
            >
              <Globe className="w-4 h-4" />
              <span className="font-semibold">{lang.toUpperCase()}</span>
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <button
                  onClick={() => toggleLang('fr')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${lang === 'fr' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  🇫 Français
                </button>
                <button
                  onClick={() => toggleLang('en')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${lang === 'en' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-gray-900">Skill</span>
                <span className="text-orange-600">Badge</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">{content.home}</Link>
                <Link href="/about" className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-1">{content.about}</Link>
                <Link href="/verify" className="text-sm font-medium text-gray-600 hover:text-gray-900">{content.verification}</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login-talent" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                {content.login}
              </Link>
              <Link href="/auth/register-talent" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                {content.register}
              </Link>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-4 space-y-3">
              <Link href="/" className="block text-sm font-medium text-gray-600 hover:text-gray-900">{content.home}</Link>
              <Link href="/about" className="block text-sm font-semibold text-orange-600">{content.about}</Link>
              <Link href="/verify" className="block text-sm font-medium text-gray-600 hover:text-gray-900">{content.verification}</Link>
              <div className="pt-3 border-t border-gray-200 flex gap-3">
                <Link href="/auth/login-talent" className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg">
                  {content.login}
                </Link>
                <Link href="/auth/register-talent" className="flex-1 px-4 py-2 text-center text-sm font-medium text-white bg-orange-600 rounded-lg">
                  {content.register}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
                <Award className="w-4 h-4" />
                {content.hero_badge}
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {content.hero_title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {content.hero_subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/register-talent"
                  className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold flex items-center gap-2"
                >
                  {content.create_portfolio}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/register-formateur"
                  className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 font-semibold"
                >
                  {content.join_formateur}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Badge Certifié</h3>
                    <p className="text-sm text-gray-500">Blockchain Verified</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-20 bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg mt-4"></div>
                </div>
                <div className="flex items-center gap-2 mt-6 text-sm text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Vérifié sur Polygon Blockchain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {content.challenge_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.challenge_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-orange-600 mb-4">
                {content.stats_graduates}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.stats_graduates_label}
              </h3>
              <p className="text-gray-600">
                {content.stats_graduates_desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-4">
                {content.stats_unemployed}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.stats_unemployed_label}
              </h3>
              <p className="text-gray-600">
                {content.stats_unemployed_desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-red-600 mb-4">
                {content.stats_verified}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.stats_verified_label}
              </h3>
              <p className="text-gray-600">
                {content.stats_verified_desc}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white text-center">
            <p className="text-xl font-semibold">
              {content.challenge_conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {content.about_title}
            </h2>
            <p className="text-xl text-gray-600">
              {content.about_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-200">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.about_mission_title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {content.about_mission_desc}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.about_vision_title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {content.about_vision_desc}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.about_blockchain_title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {content.about_blockchain_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            {content.ecosystem_title}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.ecosystem_talent_title}
              </h3>
              <p className="text-gray-600">
                {content.ecosystem_talent_desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.ecosystem_formateur_title}
              </h3>
              <p className="text-gray-600">
                {content.ecosystem_formateur_desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.ecosystem_recruiter_title}
              </h3>
              <p className="text-gray-600">
                {content.ecosystem_recruiter_desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {content.ecosystem_blockchain_title}
              </h3>
              <p className="text-gray-600">
                {content.ecosystem_blockchain_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            {content.features_title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-600 transition">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.feature_soulbound_title}
              </h3>
              <p className="text-gray-600">
                {content.feature_soulbound_desc}
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-600 transition">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cloud className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.feature_ipfs_title}
              </h3>
              <p className="text-gray-600">
                {content.feature_ipfs_desc}
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-600 transition">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.feature_verify_title}
              </h3>
              <p className="text-gray-600">
                {content.feature_verify_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            {content.testimonials_title}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: content.testimonial_1_name, role: content.testimonial_1_role, text: content.testimonial_1_text },
              { name: content.testimonial_2_name, role: content.testimonial_2_role, text: content.testimonial_2_text },
              { name: content.testimonial_3_name, role: content.testimonial_3_role, text: content.testimonial_3_text },
              { name: content.testimonial_4_name, role: content.testimonial_4_role, text: content.testimonial_4_text },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <Quote className="w-8 h-8 text-orange-600 mb-4" />
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {content.cta_title}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {content.cta_subtitle}
          </p>
          <Link
            href="/auth/register-talent"
            className="inline-flex items-center gap-2 px-12 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-lg"
          >
            {content.cta_button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">SKILLBADGE</h3>
              <p className="text-gray-400 text-sm">
                {content.brand_subtitle}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{content.footer_legal}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">{content.footer_privacy}</Link></li>
                <li><Link href="/terms" className="hover:text-white">{content.footer_terms}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{content.footer_contact}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{content.footer_email}</li>
                <li>{content.footer_phone}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SOCIAL</h4>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition">
                  <Globe className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            {content.footer_copyright}
          </div>
        </div>
      </footer>
    </div>
  )
}
