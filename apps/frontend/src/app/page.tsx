'use client'

import { ArrowRight, Users, Briefcase, Shield, Check, Award, TrendingUp, Code, Lock, Database, Cloud, Palette, Rocket, Share2, Quote, Menu, X, Globe } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [showLangDropdown, setShowLangDropdown] = useState(false)

  const toggleLang = (newLang: 'fr' | 'en') => {
    setLang(newLang)
    setShowLangDropdown(false)
  }

  const t = {
    fr: {
      // Navigation
      home: 'Accueil',
      about: 'À propos',
      verification: 'Vérification',
      login: 'Connexion',
      register: 'Inscription',
      
      // Hero Section
      hero_badge: "Certification d'État Blockchain",
      hero_title: 'Propulsez votre carrière avec une preuve de talent.',
      hero_subtitle: 'La plateforme nationale pour certifier vos compétences tech sur la blockchain et booster votre employabilité.',
      create_portfolio: 'Créer mon portfolio',
      join_formateur: 'Rejoindre en tant que formateur',
      verify_talent: 'Vérifier un talent',
      brand_subtitle: 'Badges Numériques Certifiés sur la Blockchain',
      
      // Statistics Section
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
      
      // About Section
      about_title: 'SkillBadge',
      about_subtitle: 'Badges Numériques Certifiés sur la Blockchain',
      about_mission_title: 'Notre Mission',
      about_mission_desc: 'SkillBadge révolutionne la certification des compétences numériques au Burkina Faso en utilisant la technologie blockchain pour créer des badges non falsifiables. Notre plateforme permet aux talents de prouver leurs compétences et aux recruteurs de les vérifier instantanément.',
      about_vision_title: 'Notre Vision',
      about_vision_desc: 'Devenir la référence nationale en matière de certification numérique, permettant à chaque diplômé de valoriser ses compétences sur le marché de l\'emploi local et international.',
      about_blockchain_title: 'Pourquoi Blockchain ?',
      about_blockchain_desc: 'La blockchain garantit l\'immuabilité et la traçabilité de chaque badge. Une fois émis, un badge ne peut être ni modifié ni supprimé, assurant une confiance totale pour les recruteurs et les talents.',
      
      // Ecosystem Section
      ecosystem_title: 'L\'Écosystème de Confiance SkillBadge',
      ecosystem_talent_title: 'Talent',
      ecosystem_talent_desc: 'Obtenez des badges vérifiables et partagez votre portfolio avec les recruteurs du monde entier.',
      ecosystem_formateur_title: 'Formateur',
      ecosystem_formateur_desc: 'Émettez des certifications reconnues et suivez la progression de vos étudiants.',
      ecosystem_recruiter_title: 'Recruteur',
      ecosystem_recruiter_desc: 'Vérifiez instantanément l\'authenticité des compétences claimées par les candidats.',
      ecosystem_blockchain_title: 'Blockchain',
      ecosystem_blockchain_desc: 'Infrastructure décentralisée garantissant la sécurité et l\'immuabilité des certifications.',
      
      // Features Section
      features_title: 'Fonctionnalités Clés',
      feature_soulbound_title: 'NFT Soulbound',
      feature_soulbound_desc: 'Badges non transférables liés à votre wallet, impossibles à vendre ou échanger.',
      feature_ipfs_title: 'Stockage IPFS',
      feature_ipfs_desc: 'Métadonnées décentralisées stockées sur IPFS pour une résilience maximale.',
      feature_verify_title: 'Vérification Instantanée',
      feature_verify_desc: 'QR Code et lien public pour partager et vérifier vos certifications en un clic.',
      
      // Testimonials Section
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
      
      // CTA Section
      cta_title: 'Prêt à valider votre héritage ?',
      cta_subtitle: 'Rejoignez la communauté SkillBadge et valorisez vos compétences dès aujourd\'hui.',
      cta_button: 'Commencer maintenant',
      
      // Footer
      footer_legal: 'LÉGAL',
      footer_privacy: 'Politique de confidentialité',
      footer_terms: 'Conditions d\'utilisation',
      footer_partners: 'PARTENAIRES',
      footer_contact: 'Contact institutionnel',
      footer_api: 'Documentation API',
      footer_rights: '© 2026 SkillBadge Burkina Faso',
      
      // 8 Poles Section
      poles_title: 'Explorez les 8 Pôles d\'Excellence',
      poles_subtitle: 'Des parcours certifiants alignés sur les besoins réels de l\'économie numérique du pays.',
      poles_see_all: 'Voir tous les badges',
      pole_1_title: 'Développement Logiciel',
      pole_1_desc: 'Web, Mobile, DevOps et Qualité logicielle.',
      pole_2_title: 'Infrastructure & DevOps',
      pole_2_desc: 'Cloud, Linux, Architectures',
      pole_3_title: 'Cybersécurité',
      pole_3_desc: 'Protection des infrastructures.',
      pole_4_title: 'Data & IA',
      pole_4_desc: 'Analyse et Machine Learning.',
      pole_5_title: 'Design UX/UI',
      pole_5_desc: 'Expérience utilisateur.',
      pole_6_title: 'Blockchain & Web3',
      pole_6_desc: 'Registre de transaction sécurisé',
      pole_7_title: 'Entrepreneuriat Digital',
      pole_7_desc: 'Gestion de projet et agilité business.',
      pole_8_title: 'Marketing Digital',
      pole_8_desc: 'Stratégie et réseaux sociaux.',
      
      // Security Section
      security_title: 'Sécurité Totale',
      security_unforgable: 'Infalsifiable',
      security_permanent: 'Permanent',
      security_verifiable: 'Vérifiable',
      
      // Blockchain Section
      blockchain_title: 'Sécurité Blockchain',
      blockchain_desc: 'Chaque badge émis par',
      blockchain_desc_bold: 'SkillBadge',
      blockchain_desc_end: 'est un certificat numérique unique. Il est impossible de le falsifier, de le copier ou de se l\'approprier injustement. C\'est votre preuve immuable de compétence.',
      blockchain_verify: 'Vérification Instantanée',
    },
    en: {
      // Navigation
      home: 'Home',
      about: 'About',
      verification: 'Verification',
      login: 'Sign In',
      register: 'Sign Up',
      
      // Hero Section
      hero_badge: 'Blockchain State Certification',
      hero_title: 'Boost your career with a proof of talent.',
      hero_subtitle: 'The national platform to certify your tech skills on the blockchain and boost your employability.',
      create_portfolio: 'Create my portfolio',
      join_formateur: 'Join as a trainer',
      verify_talent: 'Verify a talent',
      brand_subtitle: 'Digital Badges Certified on Blockchain',
      
      // Statistics Section
      challenge_title: 'The Human Capital Challenge',
      challenge_subtitle: 'Burkina Faso\'s digital paradox: massive training but limited employability due to lack of trust.',
      stats_graduates: '15,000+',
      stats_graduates_label: 'Youth trained / year',
      stats_graduates_desc: 'A dynamic talent pool but lacking standardized certifications.',
      stats_unemployed: 'Less than 5%',
      stats_unemployed_label: 'Recognized certified',
      stats_unemployed_desc: 'The vast majority of skills remain informal and invisible to the market.',
      stats_verified: '70%',
      stats_verified_label: 'Recruiters struggling',
      stats_verified_desc: 'Companies struggle to validate the authenticity of claimed skills.',
      challenge_conclusion: 'SkillBadge bridges the gap between theoretical training and digital job market demands.',
      
      // About Section
      about_title: 'SkillBadge',
      about_subtitle: 'Digital Badges Certified on Blockchain',
      about_mission_title: 'Our Mission',
      about_mission_desc: 'SkillBadge revolutionizes digital skills certification in Burkina Faso by using blockchain technology to create unfalsifiable badges. Our platform enables talents to prove their skills and recruiters to verify them instantly.',
      about_vision_title: 'Our Vision',
      about_vision_desc: 'Become the national reference for digital certification, allowing every graduate to showcase their skills in the local and international job market.',
      about_blockchain_title: 'Why Blockchain?',
      about_blockchain_desc: 'Blockchain guarantees the immutability and traceability of each badge. Once issued, a badge cannot be modified or deleted, ensuring total trust for recruiters and talents.',
      
      // Ecosystem Section
      ecosystem_title: 'The SkillBadge Trust Ecosystem',
      ecosystem_talent_title: 'Talent',
      ecosystem_talent_desc: 'Earn verifiable badges and share your portfolio with recruiters worldwide.',
      ecosystem_formateur_title: 'Trainer',
      ecosystem_formateur_desc: 'Issue recognized certifications and track your students\' progress.',
      ecosystem_recruiter_title: 'Recruiter',
      ecosystem_recruiter_desc: 'Instantly verify the authenticity of candidates\' claimed skills.',
      ecosystem_blockchain_title: 'Blockchain',
      ecosystem_blockchain_desc: 'Decentralized infrastructure ensuring security and immutability of certifications.',
      
      // Features Section
      features_title: 'Key Features',
      feature_soulbound_title: 'Soulbound NFT',
      feature_soulbound_desc: 'Non-transferable badges linked to your wallet, impossible to sell or trade.',
      feature_ipfs_title: 'IPFS Storage',
      feature_ipfs_desc: 'Decentralized metadata stored on IPFS for maximum resilience.',
      feature_verify_title: 'Instant Verification',
      feature_verify_desc: 'QR Code and public link to share and verify your certifications with one click.',
      
      // Testimonials Section
      testimonials_title: 'They took the leap',
      testimonial_1_name: 'SAWADODO',
      testimonial_1_role: 'Fullstack Developer',
      testimonial_1_text: 'Thanks to my SkillBadge, I was able to land a freelance contract with an agency in Lyon without having a traditional degree.',
      testimonial_2_name: 'Archad',
      testimonial_2_role: 'UI/UX Designer',
      testimonial_2_text: 'The certification process is rigorous. It gives real value to our daily work.',
      testimonial_3_name: 'Achille',
      testimonial_3_role: 'Data Consultant',
      testimonial_3_text: 'Finally a platform that understands that skills matter more than a piece of paper.',
      testimonial_4_name: 'Toussiane',
      testimonial_4_role: 'UI/UX Designer, Certified',
      testimonial_4_text: 'Thanks to the SkillBadge UI/UX, I was able to prove my skills to a tech agency in Ouagadougou. I was hired in less than two weeks.',
      
      // CTA Section
      cta_title: 'Ready to validate your legacy?',
      cta_subtitle: 'Join the SkillBadge community and showcase your skills today.',
      cta_button: 'Get started now',
      
      // Footer
      footer_legal: 'LEGAL',
      footer_privacy: 'Privacy Policy',
      footer_terms: 'Terms of Use',
      footer_partners: 'PARTNERS',
      footer_contact: 'Institutional Contact',
      footer_api: 'API Documentation',
      footer_rights: '© 2026 SkillBadge Burkina Faso',
      
      // 8 Poles Section
      poles_title: 'Explore the 8 Poles of Excellence',
      poles_subtitle: "Certified pathways aligned with the real needs of the country's digital economy.",
      poles_see_all: 'See all badges',
      pole_1_title: 'Software Development',
      pole_1_desc: 'Web, Mobile, DevOps and Software Quality.',
      pole_2_title: 'Infrastructure & DevOps',
      pole_2_desc: 'Cloud, Linux, Architectures',
      pole_3_title: 'Cybersecurity',
      pole_3_desc: 'Infrastructure protection.',
      pole_4_title: 'Data & AI',
      pole_4_desc: 'Analytics and Machine Learning.',
      pole_5_title: 'UX/UI Design',
      pole_5_desc: 'User experience.',
      pole_6_title: 'Blockchain & Web3',
      pole_6_desc: 'Secure transaction registry',
      pole_7_title: 'Digital Entrepreneurship',
      pole_7_desc: 'Project management and business agility.',
      pole_8_title: 'Digital Marketing',
      pole_8_desc: 'Strategy and social media.',
      
      // Security Section
      security_title: 'Total Security',
      security_unforgable: 'Unfalsifiable',
      security_permanent: 'Permanent',
      security_verifiable: 'Verifiable',
      
      // Blockchain Section
      blockchain_title: 'Blockchain Security',
      blockchain_desc: 'Every badge issued by',
      blockchain_desc_bold: 'SkillBadge',
      blockchain_desc_end: 'is a unique digital certificate. It is impossible to falsify, copy, or unjustly appropriate. It is your immutable proof of competence.',
      blockchain_verify: 'Instant Verification',
    }
  }

  const currentT = t[lang]

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navbar */}
      <nav className="w-full px-8 py-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="text-xl font-black text-orange-900">SkillBadge</div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-900 transition">{currentT.home}</Link>
              <a href="#about" className="hover:text-orange-900 transition cursor-pointer">{currentT.about}</a>
              <Link href="/verify" className="hover:text-orange-900 transition">{currentT.verification}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login-talent" className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition">
              {currentT.login}
            </Link>
            <Link href="/auth/register-talent" className="px-6 py-2 bg-orange-900 text-white text-sm font-semibold rounded-lg hover:bg-orange-800 transition">
              {currentT.register}
            </Link>
            <div className="relative">
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-900 transition"
              >
                <Globe className="w-4 h-4" />
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
              
              {showLangDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <button 
                    onClick={() => toggleLang('fr')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition ${lang === 'fr' ? 'text-orange-900 font-bold' : 'text-gray-700'}`}
                  >
                    🇫 Français
                  </button>
                  <button 
                    onClick={() => toggleLang('en')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition ${lang === 'en' ? 'text-orange-900 font-bold' : 'text-gray-700'}`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-900">{currentT.home}</Link>
              <a href="#about" className="hover:text-orange-900">{currentT.about}</a>
              <Link href="/verify" className="hover:text-orange-900">{currentT.verification}</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-emerald-700 text-sm font-semibold">{currentT.hero_badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              {currentT.hero_title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < currentT.hero_title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {currentT.hero_subtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < currentT.hero_subtitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
            
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/auth/register-talent" className="px-8 py-4 bg-orange-800 text-white font-bold rounded-xl hover:bg-orange-900 transition flex items-center justify-center gap-2">
                {currentT.create_portfolio}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/register-formateur" className="px-8 py-4 bg-orange-100 text-orange-800 font-bold rounded-xl hover:bg-orange-200 transition">
                {currentT.join_formateur}
              </Link>
              <Link href="/verify" className="px-8 py-4 bg-gray-200 text-orange-800 font-bold rounded-xl hover:bg-gray-300 transition">
                {currentT.verify_talent}
              </Link>
            </div>
          </div>
          
          {/* Right Side - Badge Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-orange-200/30 rounded-full blur-3xl absolute" />
              <div className="relative w-64 h-64 bg-gradient-to-br from-orange-900 to-orange-800 rounded-3xl shadow-2xl flex items-center justify-center">
                <Award className="w-32 h-32 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-300 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
        
        {/* Brand */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-normal text-gray-900 mb-2">SkillBadge</h2>
          <p className="text-sm text-gray-600 uppercase tracking-widest">{currentT.brand_subtitle}</p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentT.challenge_title}</h2>
            <p className="text-lg text-gray-600">{currentT.challenge_subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-white rounded-3xl shadow-lg border border-gray-100 text-center">
              <div className="text-6xl font-bold text-blue-950 mb-4">{currentT.stats_graduates}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{currentT.stats_graduates_label}</div>
              <p className="text-base text-gray-600">{currentT.stats_graduates_desc}</p>
            </div>
            
            <div className="p-10 bg-white rounded-3xl shadow-lg border border-gray-100 text-center">
              <div className="text-6xl font-bold text-blue-950 mb-4">{currentT.stats_unemployed}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{currentT.stats_unemployed_label}</div>
              <p className="text-base text-gray-600">{currentT.stats_unemployed_desc}</p>
            </div>
            
            <div className="p-10 bg-white rounded-3xl shadow-lg border border-gray-100 text-center">
              <div className="text-6xl font-bold text-blue-950 mb-4">{currentT.stats_verified}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{currentT.stats_verified_label}</div>
              <p className="text-base text-gray-600">{currentT.stats_verified_desc}</p>
            </div>
          </div>
          
          <div className="text-center mt-12 text-3xl font-bold text-orange-900">
            {currentT.challenge_conclusion}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentT.about_title}</h2>
            <p className="text-lg text-gray-600">{currentT.about_subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Mission */}
            <div className="p-8 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100">
              <div className="w-16 h-16 bg-orange-900 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentT.about_mission_title}</h3>
              <p className="text-gray-600 leading-relaxed">{currentT.about_mission_desc}</p>
            </div>
            
            {/* Vision */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentT.about_vision_title}</h3>
              <p className="text-gray-600 leading-relaxed">{currentT.about_vision_desc}</p>
            </div>
            
            {/* Blockchain */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-900 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentT.about_blockchain_title}</h3>
              <p className="text-gray-600 leading-relaxed">{currentT.about_blockchain_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">{currentT.ecosystem_title}</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-lg border-t-4 border-gray-300 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{currentT.ecosystem_talent_title}</h3>
              <p className="text-gray-600">{currentT.ecosystem_talent_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg border-t-4 border-orange-300 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{currentT.ecosystem_formateur_title}</h3>
              <p className="text-gray-600">{currentT.ecosystem_formateur_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg border-t-4 border-blue-300 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{currentT.ecosystem_recruiter_title}</h3>
              <p className="text-gray-600">{currentT.ecosystem_recruiter_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg border-t-4 border-purple-300 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{currentT.ecosystem_blockchain_title}</h3>
              <p className="text-gray-600">{currentT.ecosystem_blockchain_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Poles Section */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentT.poles_title}</h2>
              <p className="text-base text-gray-600">{currentT.poles_subtitle}</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-orange-900 font-bold hover:gap-3 transition">
              {currentT.poles_see_all}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-8 bg-white rounded-3xl shadow-lg border-l-4 border-orange-900">
              <div className="flex justify-between items-start mb-4">
                <Code className="w-8 h-8 text-orange-900" />
                <span className="px-3 py-1 bg-red-100 text-orange-900 text-xs font-bold rounded-full">9 Badges</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentT.pole_1_title}</h3>
              <p className="text-sm text-gray-500">{currentT.pole_1_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Cloud className="w-8 h-8 text-gray-400" />
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">6 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentT.pole_2_title}</h3>
              <p className="text-xs text-gray-500">{currentT.pole_2_desc}</p>
            </div>
            
            <div className="p-8 bg-blue-200 rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Shield className="w-8 h-8 text-blue-900" />
                <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full">5 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">{currentT.pole_3_title}</h3>
              <p className="text-xs text-blue-900/80">{currentT.pole_3_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Database className="w-8 h-8 text-gray-400" />
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">7 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentT.pole_4_title}</h3>
              <p className="text-xs text-gray-500">{currentT.pole_4_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Palette className="w-8 h-8 text-gray-400" />
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">6 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentT.pole_5_title}</h3>
              <p className="text-xs text-gray-500">{currentT.pole_5_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Share2 className="w-8 h-8 text-blue-900" />
                <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full">5 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">{currentT.pole_6_title}</h3>
              <p className="text-xs text-blue-900/80">{currentT.pole_6_desc}</p>
            </div>
            
            <div className="p-8 bg-gray-900 rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <Rocket className="w-8 h-8 text-orange-300" />
                <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">5 Badges</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{currentT.pole_7_title}</h3>
              <p className="text-sm text-white/60">{currentT.pole_7_desc}</p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">5 Badges</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentT.pole_8_title}</h3>
              <p className="text-xs text-gray-500">{currentT.pole_8_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="px-8 py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-blue-950" />
          </div>
          <h2 className="text-3xl font-black text-blue-950 mb-8">{currentT.security_title}</h2>
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 rounded-full border border-blue-950/5">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-blue-950 font-bold">{currentT.security_unforgable}</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 rounded-full border border-blue-950/5">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-blue-950 font-bold">{currentT.security_permanent}</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 rounded-full border border-blue-950/5">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-blue-950 font-bold">{currentT.security_verifiable}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Security */}
      <section className="px-8 py-16 bg-orange-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">{currentT.blockchain_title}</h2>
          </div>
          <p className="text-lg text-blue-100/80 mb-8 max-w-2xl">
            {currentT.blockchain_desc} <span className="text-blue-300 font-bold">{currentT.blockchain_desc_bold}</span> {currentT.blockchain_desc_end}
          </p>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm inline-flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-semibold">{currentT.blockchain_verify}</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">{currentT.testimonials_title}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{currentT.testimonial_1_name}</h3>
                  <p className="text-xs text-gray-600">{currentT.testimonial_1_role}</p>
                </div>
                <Quote className="w-8 h-8 text-orange-900/20 ml-auto" />
              </div>
              <p className="text-base text-gray-600">"{currentT.testimonial_1_text}"</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{currentT.testimonial_2_name}</h3>
                  <p className="text-xs text-gray-600">{currentT.testimonial_2_role}</p>
                </div>
              </div>
              <p className="text-base text-gray-600">"{currentT.testimonial_2_text}"</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{currentT.testimonial_3_name}</h3>
                  <p className="text-xs text-gray-600">{currentT.testimonial_3_role}</p>
                </div>
              </div>
              <p className="text-base text-gray-600">"{currentT.testimonial_3_text}"</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentT.testimonial_4_name}</h3>
                  <p className="text-xs text-gray-600">{currentT.testimonial_4_role}</p>
                </div>
              </div>
              <p className="text-base text-gray-600">"{currentT.testimonial_4_text}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-orange-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">{currentT.cta_title}</h2>
          <p className="text-lg text-rose-200/80 mb-8">{currentT.cta_subtitle}</p>
          <Link href="/auth/register-talent" className="inline-block px-12 py-5 bg-white text-orange-900 text-xl font-black rounded-2xl hover:bg-gray-50 transition shadow-2xl">
            {currentT.cta_button}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-black text-orange-900 mb-4">SkillBadge</div>
            <p className="text-sm text-gray-600">{currentT.footer_rights}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{currentT.footer_legal}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a href="#" className="hover:text-orange-900">{currentT.footer_privacy}</a>
              <a href="#" className="hover:text-orange-900">{currentT.footer_terms}</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{currentT.footer_partners}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a href="#" className="hover:text-orange-900">{currentT.footer_contact}</a>
              <a href="#" className="hover:text-orange-900">{currentT.footer_api}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
