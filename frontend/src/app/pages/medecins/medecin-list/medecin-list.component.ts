import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedecinService } from '../../../services/medecin.service';
import { Medecin } from '../../../models/medecin.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medecin-list.component.html',
  styleUrls: ['./medecin-list.component.css']
})
export class MedecinListComponent implements OnInit {
  medecins: Medecin[] = [];
  filtered: Medecin[] = [];
  specialiteFilter = '';
  loading = true;
  apiUrl = 'http://localhost:5001';

  specialites = ['Généraliste','Cardiologue','Dermatologue','Pédiatre','Gynécologue','Orthopédiste','Ophtalmologue','ORL','Neurologue','Psychiatre','Radiologue','Autre'];

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void { this.loadMedecins(); }

  loadMedecins(): void {
    this.loading = true;
    this.medecinService.getAll(this.specialiteFilter).subscribe({
      next: res => { this.medecins = res.data; this.filtered = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onFilter(): void { this.loadMedecins(); }

  delete(m: Medecin): void {
    Swal.fire({
      title: `Supprimer Dr. ${m.prenom} ${m.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(r => {
      if (r.isConfirmed) {
        this.medecinService.delete(m._id!).subscribe({
          next: () => { Swal.fire({ icon: 'success', title: 'Supprimé !', timer: 1500, showConfirmButton: false }); this.loadMedecins(); }
        });
      }
    });
  }

  getPhotoUrl(photo: string): string { return `${this.apiUrl}/uploads/${photo}`; }
  getInitials(m: Medecin): string { return `${m.prenom?.charAt(0)}${m.nom?.charAt(0)}`.toUpperCase(); }
}