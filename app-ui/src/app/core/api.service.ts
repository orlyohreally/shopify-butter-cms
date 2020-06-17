import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  configApp(config: { butterCMSWriteToken: string }): Observable<void> {
    return this.http.post<void>(`app/butter-cms/config`, {
      config,
    });
  }
}
