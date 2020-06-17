import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  configApp(config: { butterCMSWriteToken: string }): Observable<void> {
    const params = this.route.snapshot.queryParams;
    const queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    console.log(params, queryString);
    // return of(undefined);
    return this.http.post<void>(`app/butter-cms/config?${queryString}`, {
      config,
    });
  }
}
