import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  weather: any = null;
  weatherLoading = true;

  private apiKey = '34099264c8c4a1c455cc5b3b55409fb0';

  constructor(
    private rdvService: RendezvousService,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTodayRDV();
    this.loadWeather();
  }

  loadStats(): void {
  this.http.get<any>('http://localhost:8000/api/stats').subscribe({
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

  loadWeather(): void {
    const city = 'Tunis';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=fr`;
    this.http.get<any>(url).subscribe({
      next: data => {
        this.weather = {
          temperature: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          wind_speed: data.wind.speed,
          city: data.name,
          country: data.sys.country
        };
        this.weatherLoading = false;
      },
      error: () => this.weatherLoading = false
    });
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
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