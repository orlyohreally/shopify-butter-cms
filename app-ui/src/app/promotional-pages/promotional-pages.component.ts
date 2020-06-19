import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { PromotionalPage } from '../types';

@Component({
  selector: 'app-promotional-pages',
  templateUrl: './promotional-pages.component.html',
  styleUrls: ['./promotional-pages.component.scss'],
})
export class PromotionalPagesComponent implements OnInit {
  pages: Observable<{
    meta: {
      next_page: number | null;
      previous_page: number | null;
      count: number;
    };
    data: PromotionalPage[];
  }>;
  displayedColumns = ['image', 'title', 'description', 'actions'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.pages = this.apiService.getPromotionalPages(1);
  }

  createPage(page: PromotionalPage) {
    console.log(page);
    this.apiService.createPageFromButterCMSPage(page.slug).subscribe((res) => {
      console.log(res);
    });
  }
}
