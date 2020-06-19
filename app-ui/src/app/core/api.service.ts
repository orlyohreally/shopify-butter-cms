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

  createPageFromButterCMSPage(slug: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/butter-cms/promotional-page/`, {
      slug,
      template: `
        <h1>{{fields.twitter_card.title}}</h1>
        <img style="max=width: 100%" src="{{fields.twitter_card.image}}"/>
        <p>{{fields.twitter_card.Description}}</p>
        <h2>
        {{fields.product_promo_banner.headline}}
        </h2>
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
        {{#fields.product_promo_banner.product}}
        <div style="flex:1; padding: 10px">
        <a href="/collections/all/products/{{name}}">{{name}}</a>
        <img style="width: 100%" src="{{image}}"/>
        <p>{{description}}</p>
        </div>
        {{/fields.product_promo_banner.product}}
        </div>`,
    });
  }
}
