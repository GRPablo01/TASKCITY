// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Schemas & Controllers
const User = require('../../src/Schema/user'); // Assure-toi que le chemin est correct
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');
const authMiddleware = require('../../backend/middleware/auth'); // renomme correctement

// ================= ROUTES UTILISATEURS =================

// ✅ Créer un utilisateur
router.post('/users', userController.registerUser);

// ✅ Connexion
router.post('/login', authController.login);

// ✅ Récupérer l'utilisateur connecté
router.get('/me', authController.authenticate, authController.getCurrentUser);

// ✅ Récupérer un utilisateur par ID
router.get('/users/id/:id', userController.getUserById);

// ✅ Récupérer un utilisateur par email
router.get('/users/:email', userController.getUserByEmail);

// ✅ Récupérer tous les utilisateurs
router.get('/users', userController.getAllUsers);

// ✅ Supprimer un utilisateur par ID
router.delete('/users/:id', userController.deleteUserById);

// ✅ Modifier un utilisateur par ID (+ mise à jour nomProf si rôle 'prof')
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Si l'utilisateur est prof, mettre à jour nomProf automatiquement
    if (user.role === 'prof' && (updates.nom || updates.prenom)) {
      const nouveauNom = updates.nom || user.nom;
      const nouveauPrenom = updates.prenom || user.prenom;
      updates.nomProf = `${nouveauPrenom} ${nouveauNom}`;
    }

    user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Modifier uniquement le mot de passe d’un utilisateur
router.put('/users/:id/password', userController.changePassword);

// ✅ Récupérer la carte complète de l’utilisateur par ID (avec auth)
router.get('/card/:id', authMiddleware, userController.getUserCard);

// ✅ Récupérer tous les contacts (liste des utilisateurs)
router.get('/contacts', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
