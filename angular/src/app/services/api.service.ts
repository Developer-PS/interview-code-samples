import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getWeatherData(lat: number, lon: number): Observable<any> {
    const url = `https://csstats.mega-prism.com/api/ventilation/current-weather?lat=${lat}&lon=${lon}`;

    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        return of(null);
      })
    );
  }

  getAddressFromCoordinates(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Fehler beim Abrufen der Adressdaten:', error);
        return of(null);
      })
    );
  }

  searchLocationCoordinates(query: string): Observable<any[]> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Fehler bei der Ortssuche:', error);
        return of([]);
      })
    );
  }
}
