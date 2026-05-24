// Nettoyer les anciennes données corrompues
console.log('🧹 Nettoyage des anciennes données...')
localStorage.removeItem('user')
localStorage.removeItem('token')
console.log('✅ localStorage nettoyé. Reconnectez-vous.')
