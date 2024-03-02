import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailValuesDTO } from '@app/models/backend/emailvaluesdto';
import { ChangePasswordDTO } from '@app/models/backend/changepassworddto';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'https://dotval-app-6908ca550bb8.herokuapp.com/gateway/email'; // Reemplaza con la URL de tu servidor
  constructor(private http: HttpClient) { }

  sendForgotPasswordEmail(email: string): Observable<any> {
    const url = `${this.baseUrl}/send-html`;
    const emailDTO = new EmailValuesDTO(email);
    return this.http.post(url, emailDTO);
  }


  changePassword(dto: ChangePasswordDTO): Observable<any> {
    const url = `${this.baseUrl}/change-password`;
    return this.http.post(url, dto);
  }


  deleteAccount(email: string): Observable<any> {
    const url = `${this.baseUrl}/send-htmluser`; // Nueva URL para eliminar cuenta
    const emailDTO = new EmailValuesDTO(email);

    console.log('Cuerpo (body) enviado:', { emailvaluesdto: emailDTO });

    return this.http.post(url, emailDTO);
  }


}
