// ==============================
// 📦 Import des modules
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// ==============================
// ⚙️ Création de l'application Express
// ==============================
const app = express();
const PORT = 3000;

// ==============================
// ✅ Middleware CORS (Angular + tests mobiles)
// ==============================
app.use(cors({
  origin: ['http://localhost:4200'], // autorise Angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ✅ PATCH ajouté ici
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user'], // tu peux garder ça
  credentials: true
}));


// ==============================
// 🧱 Middlewares globaux
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📁 Création du dossier uploads si inexistant
// ==============================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// ==============================
// 🖼️ Configuration de multer (upload fichiers)
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ==============================
// 🌍 Connexion à MongoDB
// ==============================
mongoose.connect('mongodb://127.0.0.1:27017/dysone')
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));



const userRoutes = require('./backend/routes/User.Routes');
const authRoutes = require('./backend/routes/User.Routes'); // vérifier si c’est voulu
const utilisateurRoutes = require('./backend/routes/utilisateur.Routes');


// ==============================
// 🧭 Déclaration des routes API
// ==============================
app.use('/api/users', userRoutes);
app.use('/api/dysone', authRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);




// ==============================
// 🏠 Routes de test
// ==============================
app.get('/', (req, res) => res.send('✅ Serveur ASDAM opérationnel !'));
app.get('/api', (req, res) => res.json({ message: 'Bienvenue sur l’API ASDAM !' }));

// ==============================
// 🚀 Lancement du serveur
// ==============================
const IP_LOCALE = '192.168.1.43'; // 🟢 à remplacer par TON IP locale exacte

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur backend démarré sur http://${IP_LOCALE}:${PORT}`);
  console.log(`📡 Accessible depuis ton téléphone via http://${IP_LOCALE}:${PORT}`);
});
