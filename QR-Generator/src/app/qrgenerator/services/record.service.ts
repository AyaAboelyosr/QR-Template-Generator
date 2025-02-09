import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RecordPreview } from '../viewmodels/record-preview';
import { RecordListItem } from '../viewmodels/record-list-item';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  
  private apiUrl = 'https://localhost:7110/api/Record'; 

  constructor(private http: HttpClient) {}
 createRecord(record:any): Observable<any> {
    console.log('Record:', record); // Debug log
      return this.http
        .post<any>(`${this.apiUrl}`, record)
        .pipe(catchError(this.handleError));
    }
  updateRecord( record: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, record)
      .pipe(
        catchError(this.handleError)
      );
  }
  getRecords(): Observable<any[]> {
    return this.http.get<RecordListItem[]>(`${this.apiUrl}`);
  }
  getRecordPreview( recordId: number|null): Observable<RecordPreview> {
    return this.http.get<RecordPreview>(`${this.apiUrl}/${recordId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteRecord(recordId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${recordId}`);
  }

   private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          
          errorMessage = `Error: ${error.error.message}`;
        } else {
       
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }
}
