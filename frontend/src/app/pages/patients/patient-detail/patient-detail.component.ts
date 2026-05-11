import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  rdvs: any[] = [];
  loading = true;
  apiUrl = 'http://localhost:5000';

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getById(id).subscribe({
      next: res => { this.patient = res.data; this.loading = false; }
    });
    this.patientService.getPatientRDV(id).subscribe({
      next: res => this.rdvs = res.data
    });
  }

  getStatutClass(s: string): string {
    const m: any = { 'planifié': 'planifie', 'confirmé': 'confirme', 'terminé': 'termine', 'annulé': 'annule', 'en cours': 'en-cours' };
    return m[s] || 'planifie';
  }

  getPhotoUrl(photo: string): string { return `${this.apiUrl}/uploads/${photo}`; }
}