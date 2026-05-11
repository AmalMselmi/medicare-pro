import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RendezvousService } from '../../services/rendezvous.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  rdvAujourdhui: any[] = [];
  loading = true;

  constructor(private rdvService: RendezvousService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTodayRDV();
  }

  loadStats(): void {
    this.rdvService.getStats().subscribe({
      next: res => { this.stats = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadTodayRDV(): void {
    const today = new Date().toISOString().split('T')[0];
    this.rdvService.getAll({ dateDebut: today, dateFin: today }).subscribe({
      next: res => this.rdvAujourdhui = res.data.slice(0, 5)
    });
  }

  getStatutClass(s: string): string {
    const map: any = {
      'planifié': 'planifie', 'confirmé': 'confirme',
      'terminé': 'termine', 'annulé': 'annule', 'en cours': 'en-cours'
    };
    return map[s] || 'planifie';
  }

  get user() { return this.authService.getUser(); }
}