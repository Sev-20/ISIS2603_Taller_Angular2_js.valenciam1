import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherDetail } from '../models/weather.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private API_KEY = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getWeather(cityName: string): Observable<WeatherDetail> {
    const url = `https://api.weatherapi.com/v1/current.json?key=${this.API_KEY}&q=${cityName}`;
    return this.http.get<any>(url).pipe(
      map(res => ({
        temp_c: res.current.temp_c,
        condition: res.current.condition.text,
        humidity: res.current.humidity
      }))
    );
  }
}