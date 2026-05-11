import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedecinService } from '../../../services/medecin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medecin-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './medecin-form.component.html',
  styleUrls: ['./medecin-form.component.css']
})
export class MedecinFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  medecinId: string | null = null;
  loading = false;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  apiUrl = 'http://localhost:5000';

  specialites = ['Généraliste','Cardiologue','Dermatologue','Pédiatre','Gynécologue','Orthopédiste','Ophtalmologue','ORL','Neurologue','Psychiatre','Radiologue','Autre'];

  constructor(
    private fb: FormBuilder,
    private medecinService: MedecinService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      specialite: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', Validators.email],
      disponible: [true],
      'horaires.debut': ['08:00'],
      'horaires.fin': ['17:00']
    });
  }

  ngOnInit(): void {
    this.medecinId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.medecinId;

    if (this.isEdit && this.medecinId) {
      this.medecinService.getById(this.medecinId).subscribe({
        next: res => {
          const m = res.data;
          this.form.patchValue({
            nom: m.nom, prenom: m.prenom, specialite: m.specialite,
            telephone: m.telephone, email: m.email || '', disponible: m.disponible,
            'horaires.debut': m.horaires?.debut || '08:00',
            'horaires.fin': m.horaires?.fin || '17:00'
          });
          if (m.photo) this.photoPreview = `${this.apiUrl}/uploads/${m.photo}`;
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
    const v = this.form.value;
    formData.append('nom', v.nom);
    formData.append('prenom', v.prenom);
    formData.append('specialite', v.specialite);
    formData.append('telephone', v.telephone);
    if (v.email) formData.append('email', v.email);
    formData.append('disponible', v.disponible);
    formData.append('horaires[debut]', v['horaires.debut']);
    formData.append('horaires[fin]', v['horaires.fin']);
    if (this.selectedPhoto) formData.append('photo', this.selectedPhoto);

    const req = this.isEdit
      ? this.medecinService.update(this.medecinId!, formData)
      : this.medecinService.create(formData);

    req.subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: this.isEdit ? 'Médecin mis à jour !' : 'Médecin créé !', timer: 1800, showConfirmButton: false });
        this.router.navigate(['/medecins']);
      },
      error: err => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Erreur', text: err.error?.message });
      },
      complete: () => this.loading = false
    });
  }

  get f() { return this.form.controls; }
}