export interface Medecin {
  _id?: string;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email?: string;
  disponible?: boolean;
  horaires?: { debut: string; fin: string; };
  photo?: string;
  nomComplet?: string;
}