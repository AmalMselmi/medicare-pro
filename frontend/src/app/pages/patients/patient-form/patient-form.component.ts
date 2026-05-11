import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  patientId: string | null = null;
  loading = false;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  apiUrl = 'http://localhost:5001';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', Validators.email],
      adresse: [''],
      groupeSanguin: [''],
      antecedents: [''],
      allergie: ['']
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.patientId && this.route.snapshot.url.some(s => s.path === 'edit');

    if (this.isEdit && this.patientId) {
      this.patientService.getById(this.patientId).subscribe({
        next: res => {
          const p = res.data;
          this.form.patchValue({
            ...p,
            dateNaissance: p.dateNaissance ? p.dateNaissance.split('T')[0] : ''
          });
          if (p.photo) this.photoPreview = `${this.apiUrl}/uploads/${p.photo}`;
        }
      });
    }
  }

  onPhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.photoPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      if (this.form.value[key]) formData.append(key, this.form.value[key]);
    });
    if (this.selectedPhoto) formData.append('photo', this.selectedPhoto);

    const request = this.isEdit
      ? this.patientService.update(this.patientId!, formData)
      : this.patientService.create(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? 'Patient mis à jour !' : 'Patient créé !',
          timer: 1800, showConfirmButton: false
        });
        this.router.navigate(['/patients']);
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