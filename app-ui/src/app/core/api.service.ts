import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Collection, PromotionalPage } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'app';

  constructor(private http: HttpClient) {}

  configApp(config: { butterCMSWriteToken: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/butter-cms/config`, {
      config,
    });
  }

  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/collections`);
  }

  getPromotionalPages(
    pageNumber: number
  ): Observable<{
    meta: {
      next_page: number | null;
      previous_page: number | null;
      count: number;
    };
    data: PromotionalPage[];
  }> {
    return this.http.get<{
      meta: {
        next_page: number | null;
        previous_page: number | null;
        count: number;
      };
      data: PromotionalPage[];
    }>(`${this.apiUrl}/butter-cms/promotional-pages/page/${pageNumber}`);
  }

  createPageFromCollection(collection: Collection): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/butter-cms/collections/page`, {
      collectionId: collection.id,
    });
  }

  createPageFromButterCMSPage(
    slug: string,
    template: string
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/butter-cms/promotional-page/`, {
      slug,
      template,
    });
  }
}
