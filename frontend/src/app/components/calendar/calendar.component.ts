import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendezvousService } from '../../services/rendezvous.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  calendarDays: any[] = [];
  rdvs: any[] = [];
  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  constructor(private rdvService: RendezvousService) {}

  ngOnInit(): void { this.buildCalendar(); this.loadRDVs(); }

  buildCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.calendarDays = [];

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      this.calendarDays.push({ day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      this.calendarDays.push({
        day: d,
        date: new Date(this.currentYear, this.currentMonth, d),
        isToday: this.isToday(d)
      });
    }
  }

  loadRDVs(): void {
    const debut = new Date(this.currentYear, this.currentMonth, 1).toISOString();
    const fin = new Date(this.currentYear, this.currentMonth + 1, 0).toISOString();
    this.rdvService.getAll({ dateDebut: debut.split('T')[0], dateFin: fin.split('T')[0] }).subscribe({
      next: res => this.rdvs = res.data
    });
  }

  getRDVsForDay(day: number): any[] {
    return this.rdvs.filter(rdv => {
      const d = new Date(rdv.date);
      return d.getDate() === day && d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear;
    });
  }

  prevMonth(): void {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else this.currentMonth--;
    this.buildCalendar(); this.loadRDVs();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else this.currentMonth++;
    this.buildCalendar(); this.loadRDVs();
  }

  isToday(day: number): boolean {
    const t = new Date();
    return day === t.getDate() && this.currentMonth === t.getMonth() && this.currentYear === t.getFullYear();
  }
}