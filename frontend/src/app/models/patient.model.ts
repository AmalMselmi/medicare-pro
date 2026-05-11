export interface Patient {
  _id?: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'Homme' | 'Femme';
  telephone: string;
  email?: string;
  adresse?: string;
  groupeSanguin?: string;
  antecedents?: string;
  allergie?: string;
  photo?: string;
  actif?: boolean;
  nomComplet?: string;
  age?: number;
  createdAt?: string;
}