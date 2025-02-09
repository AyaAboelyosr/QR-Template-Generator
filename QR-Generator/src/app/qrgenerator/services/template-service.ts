import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { QRTemplate } from '../viewmodels/qrtemplate';
import { Response } from  '../viewmodels/response';
import { QRTemplateInfo } from '../viewmodels/qrtemplate-info';
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private apiUrl = 'https://localhost:7110/api/TemplateSelector';
  constructor(private http: HttpClient) { }

  getTemplates(): Observable<QRTemplateInfo[] | Response> {
    return this.http
      .get<QRTemplateInfo[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }
  getTemplateById(id: number): Observable<QRTemplate > {
    return this.http
      .get<QRTemplate>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  createRecord(record:any): Observable<Number> {
    return this.http
      .post<Number>(`${this.apiUrl}`, record)
      .pipe(catchError(this.handleError));
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
