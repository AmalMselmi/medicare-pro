import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filtered: Patient[] = [];
  search = '';
  loading = true;
  apiUrl = 'http://localhost:5001';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void { this.loadPatients(); }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAll().subscribe({
      next: res => { this.patients = res.data; this.filtered = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    this.patientService.getAll(this.search).subscribe({
      next: res => this.filtered = res.data
    });
  }

  delete(patient: Patient): void {
    Swal.fire({
      title: `Supprimer ${patient.prenom} ${patient.nom} ?`,
      text: 'Cette action supprimera aussi tous ses rendez-vous.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.patientService.delete(patient._id!).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Supprimé !', timer: 1500, showConfirmButton: false });
            this.loadPatients();
          }
        });
      }
    });
  }

  getPhotoUrl(photo: string | undefined): string {
    return photo ? `${this.apiUrl}/uploads/${photo}` : '';
  }

  getInitials(p: Patient): string {
    return `${p.prenom?.charAt(0)}${p.nom?.charAt(0)}`.toUpperCase();
  }
}