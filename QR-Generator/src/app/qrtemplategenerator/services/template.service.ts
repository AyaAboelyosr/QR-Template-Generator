import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Field } from 'src/app/qrtemplategenerator/Models/Field';
import { AuthService } from 'src/app/authentication/services/auth.service';




@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private apiUrl = 'https://localhost:7110/api/QRTemplate';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {
    
  }
    authheader = this.authService.getAuthHeaders();
  getAllTemplates(): Observable<any[]> {
    
    return this.http.get<any[]>(this.apiUrl,{headers:this.authheader});
  }

  getTemplateById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }
  addTemplate(newTemplate: any): Observable<any> {
    return this.http.post(this.apiUrl, newTemplate,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

  updateTemplate(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData,{headers:this.authheader});
  }
  
  deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

   // Section methods
  
   addSection(templateId: string, section: { title: string; type: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${templateId}/sections`, section,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }
  
  

  updateSection(templateId: string, sectionId: string, section: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${templateId}/sections/${sectionId}`, section,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

  deleteSection(templateId: string, sectionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${templateId}/sections/${sectionId}`,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

  getSectionFields(templateId: string, sectionId: string): Observable<Field[]> {
    const url = `${this.apiUrl}/${templateId}/sections/${sectionId}/fields`;
    console.log('Request URL:', url); // Log the request URL
    return this.http.get<Field[]>(url,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }


  // Field methods
 

  addField(templateId: string, sectionId: string, field: any): Observable<any> {
    console.log('Adding field:', { templateId, sectionId, field }); // Debug here
    return this.http.post(`${this.apiUrl}/${templateId}/sections/${sectionId}/fields`, field,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }
  
 
  

  updateField(templateId: string, sectionId: string, fieldId: string, field: any): Observable<any> {
    console.log('Updating field:', { templateId, sectionId, fieldId, field }); // Debug here
    return this.http.put(`${this.apiUrl}/${templateId}/sections/${sectionId}/fields/${fieldId}`, field,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

  deleteField(templateId: string, sectionId: string, fieldId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${templateId}/sections/${sectionId}/fields/${fieldId}`,{headers:this.authheader}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
     
      errorMessage = `Error: ${error.error.message}`;
    } else {
     
      if (error.status === 400 && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(errorMessage);
  }
}
