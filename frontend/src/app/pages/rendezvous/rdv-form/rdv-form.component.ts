import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RendezvousService } from '../../../services/rendezvous.service';
import { PatientService } from '../../../services/patient.service';
import { MedecinService } from '../../../services/medecin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdv-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './rdv-form.component.html',
  styleUrls: ['./rdv-form.component.css']
})
export class RdvFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  rdvId: string | null = null;
  loading = false;
  patients: any[] = [];
  medecins: any[] = [];
  statuts = ['planifié', 'confirmé', 'en cours', 'terminé', 'annulé'];
  heures = this.generateHeures();
  todayStr: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private rdvService: RendezvousService,
    private patientService: PatientService,
    private medecinService: MedecinService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      medecin: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(3)]],
      statut: ['planifié'],
      notes: [''],
      duree: [30]
    });
  }

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: res => this.patients = res.data });
    this.medecinService.getAll().subscribe({ next: res => this.medecins = res.data });

    this.rdvId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.rdvId;

    if (this.isEdit && this.rdvId) {
      this.rdvService.getById(this.rdvId).subscribe({
        next: res => {
          const rdv = res.data;
          this.form.patchValue({
            ...rdv,
            patient: typeof rdv.patient === 'object' ? rdv.patient._id : rdv.patient,
            medecin: typeof rdv.medecin === 'object' ? rdv.medecin._id : rdv.medecin,
            date: rdv.date ? rdv.date.split('T')[0] : ''
          });
        }
      });
    }
  }

  generateHeures(): string[] {
    const hours = [];
    for (let h = 8; h <= 18; h++) {
      hours.push(`${String(h).padStart(2, '0')}:00`);
      hours.push(`${String(h).padStart(2, '0')}:30`);
    }
    return hours;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const request = this.isEdit
      ? this.rdvService.update(this.rdvId!, this.form.value)
      : this.rdvService.create(this.form.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? 'RDV mis à jour !' : 'RDV créé !',
          timer: 1800, showConfirmButton: false
        });
        this.router.navigate(['/rendezvous']);
      },
      error: err => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Erreur', text: err.error?.message || 'Une erreur est survenue.' });
      },
      complete: () => this.loading = false
    });
  }

  get f() { return this.form.controls; }
}