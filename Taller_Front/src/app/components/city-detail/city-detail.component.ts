import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.model';
import { WeatherRecord } from '../../models/weather-record.model';
import { WeatherDetail } from '../../models/weather.model';
import { WeatherRecordService } from '../../services/weather-record.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherRecordService = inject(WeatherRecordService);
  private weatherService = inject(WeatherService);  // ← agregado

  @Input() city!: City;

  weatherRecords: WeatherRecord[] = [];
  weatherDetail: WeatherDetail | null = null;  // ← agregado
  loading: boolean = false;                     // ← agregado

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      // HU-04: cargar historial
      this.weatherRecordService.getRecords(this.city.id)
        .subscribe(records => this.weatherRecords = records);

      // HU-03: obtener clima actual
      this.loading = true;
      this.weatherDetail = null;
      this.weatherService.getWeather(this.city.name).subscribe({
        next: (data) => {
          this.weatherDetail = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  saveWeather(): void {
    // HU-04: guardar clima actual como registro
    if (!this.weatherDetail) return;

    const record = {
      tempC: this.weatherDetail.temp_c,
      condition: this.weatherDetail.condition,
      humidity: this.weatherDetail.humidity
    };

    this.weatherRecordService.saveRecord(this.city.id, record).subscribe({
      next: () => {
        // recargar historial sin refresh de página
        this.weatherRecordService.getRecords(this.city.id)
          .subscribe(records => this.weatherRecords = records);
      }
    });
  }
}