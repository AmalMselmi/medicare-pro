// Initialisation MongoDB avec données de démonstration
db = db.getSiblingDB('medical_db');

// Créer un utilisateur admin
db.users.insertOne({
  nom: "Administrateur",
  email: "admin@medicare.tn",
  motDePasse: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS8m8uy", // 123456
  role: "admin",
  actif: true,
  createdAt: new Date()
});

// Créer des médecins de démonstration
db.medecins.insertMany([
  {
    nom: "Gharbi",
    prenom: "Ahmed",
    specialite: "Cardiologue",
    telephone: "22334455",
    email: "dr.gharbi@medicare.tn",
    disponible: true,
    horaires: { debut: "08:00", fin: "17:00" },
    createdAt: new Date()
  },
  {
    nom: "Ben Ali",
    prenom: "Sana",
    specialite: "Pédiatre",
    telephone: "33445566",
    email: "dr.benali@medicare.tn",
    disponible: true,
    horaires: { debut: "09:00", fin: "18:00" },
    createdAt: new Date()
  }
]);

print('✅ Base de données initialisée avec succès !');