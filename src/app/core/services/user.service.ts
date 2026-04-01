import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;
  private apiGeMe = `${environment.apiUrl}`

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`); 
  }

  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMe(): Observable<any> {
  return this.http.get(`${this.apiGeMe}/auth/me`);
}
}