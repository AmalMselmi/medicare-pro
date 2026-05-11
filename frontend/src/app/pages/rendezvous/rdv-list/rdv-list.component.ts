import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RendezvousService } from '../../../services/rendezvous.service';
import { MedecinService } from '../../../services/medecin.service';
import { Medecin } from '../../../models/medecin.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdv-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './rdv-list.component.html',
  styleUrls: ['./rdv-list.component.css']
})
export class RdvListComponent implements OnInit {
  rdvs: any[] = [];
  medecins: Medecin[] = [];
  loading = true;
  filters = { dateDebut: '', dateFin: '', medecin: '', statut: '' };
  statuts = ['planifié', 'confirmé', 'en cours', 'terminé', 'annulé'];

  constructor(private rdvService: RendezvousService, private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.loadRDVs();
    this.medecinService.getAll().subscribe({ next: res => this.medecins = res.data });
  }

  loadRDVs(): void {
    this.loading = true;
    this.rdvService.getAll(this.filters).subscribe({
      next: res => { this.rdvs = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  resetFilters(): void {
    this.filters = { dateDebut: '', dateFin: '', medecin: '', statut: '' };
    this.loadRDVs();
  }

  updateStatut(rdv: any, statut: string): void {
    this.rdvService.update(rdv._id, { statut }).subscribe({
      next: () => {
        rdv.statut = statut;
        Swal.fire({ icon: 'success', title: 'Statut mis à jour', timer: 1200, showConfirmButton: false });
      }
    });
  }

  delete(rdv: any): void {
    Swal.fire({
      title: 'Supprimer ce rendez-vous ?',
      text: `RDV du ${new Date(rdv.date).toLocaleDateString('fr-FR')} à ${rdv.heure}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.rdvService.delete(rdv._id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Supprimé !', timer: 1500, showConfirmButton: false });
            this.loadRDVs();
          }
        });
      }
    });
  }

  getStatutClass(s: string): string {
    const m: any = { 'planifié': 'planifie', 'confirmé': 'confirme', 'terminé': 'termine', 'annulé': 'annule', 'en cours': 'en-cours' };
    return m[s] || 'planifie';
  }
}