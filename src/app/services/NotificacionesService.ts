import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private apiUrl = 'https://dotval-app-6908ca550bb8.herokuapp.com/api/gateway/dispositivo';

  constructor(private http: HttpClient) {}

  enviarNotificacion(negocioId: string, body: any): Observable<any> {
    const endpoint = `${this.apiUrl}/sendNotificationToBusiness/${negocioId}`;

    // Especifica que la respuesta no se debe analizar como JSON
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json',  // Indica que esperamos una respuesta de tipo texto
    };

    return this.http.post(endpoint, body, options).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;  // Propaga el error para que el suscriptor también pueda manejarlo
      })
    );
  }


  getDeviceByDeviceId(deviceId: string): Observable<any> {
    const endpoint = `${this.apiUrl}/getDevice/${deviceId}`;

    // Especifica que la respuesta se espera como JSON
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(endpoint, options).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;  // Propaga el error para que el suscriptor también pueda manejarlo
      })
    );
  }

  sendNotification(deviceId: string, notification: any): Observable<any> {
    const endpoint = `${this.apiUrl}/sendNotification/${deviceId}`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json',
    };

    return this.http.post(endpoint, notification, options).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;
      })
    );
  }



  getAllDevices(): Observable<any[]> {
    const endpoint = `${this.apiUrl}/getAllDevices`;

    return this.http.get<any[]>(endpoint);
  }


}

