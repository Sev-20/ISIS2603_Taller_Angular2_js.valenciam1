import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { City } from '../../models/city.model';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit {
  private countryService = inject(CountryService);
  private cityService = inject(CityService);

  @Output() cityCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  // Propiedades de estado
  cityName: string = '';
  selectedCountryId: number | null = null;
  countries: Country[] = [];

  ngOnInit(): void {
    // Carga los países al inicializar el componente
    this.countryService.getCountries().subscribe({
      next: (data) => this.countries = data
    });
  }

  onSave(): void {
  if (!this.cityName || !this.selectedCountryId) return;

  // El ! le dice a TypeScript que aquí selectedCountryId ya no es null
  this.cityService.createCity(this.selectedCountryId!, { name: this.cityName }).subscribe({
    next: () => {
      this.cityCreated.emit();
      this.cityName = '';
      this.selectedCountryId = null;
    }
  });
}
onCancel(): void {
  this.cancel.emit();
}
}