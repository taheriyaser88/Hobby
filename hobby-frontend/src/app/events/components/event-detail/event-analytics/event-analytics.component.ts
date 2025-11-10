import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';

declare var Chart: any;

interface CanvasWithChart extends HTMLCanvasElement {
  chart?: any;
}

@Component({
  selector: 'app-event-analytics',
  standalone: true,
  imports: [],
  templateUrl: './event-analytics.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventAnalyticsComponent implements AfterViewInit {

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  initCharts() {
    const salesCanvas = document.getElementById('salesChart') as CanvasWithChart;
    const pieCanvas = document.getElementById('ticketPie') as CanvasWithChart;

    if (salesCanvas && !salesCanvas.chart) {
      const ctx = salesCanvas.getContext('2d');
      salesCanvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['هفته -3', 'هفته -2', 'هفته -1', 'این هفته'],
          datasets: [{
            label: 'فروش (تعداد بلیت)',
            data: [40, 90, 150, 250],
            borderColor: 'rgba(26,115,232,0.9)',
            backgroundColor: 'rgba(26,115,232,0.12)',
            tension: 0.3,
            fill: true,
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' } } },
          maintainAspectRatio: false
        }
      });
    }

    if (pieCanvas && !(pieCanvas as CanvasWithChart).chart) {
      const ctx2 = pieCanvas.getContext('2d');
      (pieCanvas as CanvasWithChart).chart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['عمومی', 'VIP'],
          datasets: [{
            data: [180, 70],
            backgroundColor: ['#1A73E8', '#F9A825']
          }]
        },
        options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
      });
    }
  }
}
