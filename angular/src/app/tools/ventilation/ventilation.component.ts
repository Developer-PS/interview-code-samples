import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ventilation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatSnackBarModule
  ],
  templateUrl: './ventilation.component.html',
  styleUrl: './ventilation.component.scss',
})
export class VentilationComponent {
  ventilationForm: FormGroup;
  result: string = '';
  displayResult: boolean = false;
  loading: boolean = false;
  location: string = '';
  useCurrentLocation: boolean = true;  // Standardwert: true
  lastUpdated: Date | null = null;

  // Variablen für die absoluten Luftfeuchtigkeitswerte
  indoorAbsoluteHumidity: number = 0;
  outdoorAbsoluteHumidity: number = 0;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    this.ventilationForm = new FormGroup({
      indoorTemperature: new FormControl(null, [Validators.required, Validators.min(-50), Validators.max(100)]),
      indoorHumidity: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      outdoorTemperature: new FormControl(null, [Validators.min(-50), Validators.max(100)]),
      outdoorHumidity: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      location: new FormControl(''),
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Schließen', {
      duration: 10000
    });
  }

  getGeolocation(): void {
    if (!this.useCurrentLocation) {
      return;
    }

    this.loading = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Adresse von Koordinaten holen
          this.getAddressFromCoordinates(lat, lon);

          // Wetterdaten von Koordinaten holen
          this.getWeatherData(lat, lon);
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.loading = false;
          this.showError('Standortbestimmung fehlgeschlagen. Bitte geben Sie Ihren Standort manuell ein.');
          // Bei Fehler den Toggle automatisch auf manuelle Eingabe umstellen
          this.useCurrentLocation = false;
        }
      );
    } else {
      this.loading = false;
      this.showError('Standortbestimmung fehlgeschlagen. Bitte geben Sie Ihren Standort manuell ein.');
      // Bei fehlendem Support den Toggle automatisch auf manuelle Eingabe umstellen
      this.useCurrentLocation = false;
    }
  }

  getAddressFromCoordinates(lat: number, lon: number): void {
    this.apiService.getAddressFromCoordinates(lat, lon).subscribe(data => {
      if (data && data.display_name) {
        this.location = data.display_name;
      }
    });
  }

  searchLocation(): void {
    const locationQuery = this.ventilationForm.get('location')?.value;
    if (!locationQuery) return;

    this.loading = true;

    this.apiService.searchLocationCoordinates(locationQuery).subscribe(data => {
      if (data && data.length > 0) {
        const result = data[0];
        this.location = result.display_name;
        this.getWeatherData(result.lat, result.lon);
      } else {
        this.loading = false;
        this.showError('Ort konnte nicht gefunden werden.');
      }
    });
  }

  getWeatherData(lat: number, lon: number): void {
    this.apiService.getWeatherData(lat, lon).subscribe(data => {
      this.loading = false;

      if (data && data.temperature && data.humidity) {
        this.ventilationForm.patchValue({
          outdoorTemperature: data.temperature,
          outdoorHumidity: data.humidity
        });

        // Aktualisiere den Zeitstempel der letzten Aktualisierung
        this.lastUpdated = new Date();
      } else {
        this.showError('Wetterdaten konnten nicht abgerufen werden.');
      }
    });
  }

  toggleLocationMode(): void {
    // Nur den Toggle-Status ändern, keine API-Anfragen auslösen
    this.useCurrentLocation = !this.useCurrentLocation;
  }

  updateWeatherData(): void {
    if (this.useCurrentLocation) {
      this.getGeolocation();
    } else {
      this.searchLocation();
    }
  }

  calculateVentilation(): void {
    const indoorTemp = this.ventilationForm.get('indoorTemperature')?.value;
    const indoorHumid = this.ventilationForm.get('indoorHumidity')?.value;
    const outdoorTemp = this.ventilationForm.get('outdoorTemperature')?.value;
    const outdoorHumid = this.ventilationForm.get('outdoorHumidity')?.value;

    if (!indoorTemp || !indoorHumid || !outdoorTemp || !outdoorHumid) {
      this.showError('Bitte alle erforderlichen Felder ausfüllen.');
      return;
    }

    // Berechnung der absoluten Luftfeuchtigkeit (Bolton-Formel)
    this.indoorAbsoluteHumidity = this.calculateAbsoluteHumidity(indoorTemp, indoorHumid);
    this.outdoorAbsoluteHumidity = this.calculateAbsoluteHumidity(outdoorTemp, outdoorHumid);

    this.displayResult = true;

    if (this.indoorAbsoluteHumidity > this.outdoorAbsoluteHumidity) {
      this.result = 'JA';
    } else {
      this.result = 'NEIN';
    }
  }

  // Bolton-Formel zur Berechnung der absoluten Luftfeuchtigkeit
  // https://carnotcycle.wordpress.com/2012/08/04/how-to-convert-relative-humidity-to-absolute-humidity/
  calculateAbsoluteHumidity(temp: number, relHumidity: number): number {
    const saturationVaporPressure = 6.112 * Math.exp((17.67 * temp) / (temp + 243.5));
    const vaporPressure = saturationVaporPressure * relHumidity;
    return (vaporPressure * 2.1674) / (273.15 + temp);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatHumidity(value: number): string {
    return value.toFixed(2);
  }
}
