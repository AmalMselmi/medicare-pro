import { Patient } from './patient.model';
import { Medecin } from './medecin.model';

export interface Rendezvous {
  _id?: string;
  patient: Patient | string;
  medecin: Medecin | string;
  date: string;
  heure: string;
  motif: string;
  statut?: 'planifié' | 'confirmé' | 'en cours' | 'terminé' | 'annulé';
  notes?: string;
  duree?: number;
  createdAt?: string;
}