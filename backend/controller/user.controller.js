const User = require('../../src/Schema/user');
const bcrypt = require('bcrypt');


// -------------------- INSCRIPTION --------------------
exports.registerUser = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      role,
      codeProf = null,
      codeParent = null,
      initiale = '',
      cguValide = false,
      dysListe = []
    } = req.body;

    console.log('Données reçues pour l’inscription :', req.body);

    // Vérification champs obligatoires
    if (!email || !password || !nom || !prenom || !role) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    // Vérification utilisateur existant
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Utilisateur déjà existant :', email);
      return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      codeProf,
      codeParent,
      initiale,
      cguValide,
      dysListe
    });

    await user.save();
    console.log('Utilisateur créé avec succès :', user.email);
    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user._id });

  } catch (err) {
    console.error('Erreur registerUser :', err);
    res.status(500).json({ message: 'Erreur serveur interne', error: err.message });
  }
};


// -------------------- RÉCUPÉRER UN UTILISATEUR PAR EMAIL --------------------
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error('Erreur getUserByEmail :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- RÉCUPÉRER UN UTILISATEUR PAR ID --------------------
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) {
    console.error('Erreur getUserById :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- SUPPRIMER UN UTILISATEUR --------------------
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    console.log('Utilisateur supprimé :', req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur deleteUserById :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- RÉCUPÉRER TOUS LES UTILISATEURS --------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur getAllUsers :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- MODIFIER UN UTILISATEUR --------------------
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) delete updates.password; // ne pas modifier le mot de passe ici

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    console.log('Utilisateur mis à jour :', updatedUser.email);
    res.json(updatedUser);
  } catch (err) {
    console.error('Erreur updateUser :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- CHANGER LE MOT DE PASSE --------------------
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log('Mot de passe mis à jour pour :', user.email);
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur changePassword :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- RÉCUPÉRER LE PROFIL CONNECTÉ --------------------
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error('Erreur getMe :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- RÉCUPÉRER CARTE UTILISATEUR --------------------
exports.getUserCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -cguValide');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const userCard = {
      nom: user.nom,
      prenom: user.prenom,
      equipe: user.equipe,
      role: user.role,
      initiale: user.initiale,
      dysListe: user.dysListe
    };

    res.json(userCard);
  } catch (err) {
    console.error('Erreur getUserCard :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
