import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Collection } from '../types';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  collections: Observable<Collection[]>;
  displayedColumns = ['image', 'title', 'description', 'actions'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.collections = this.apiService.getCollections();
  }

  createPage(collection: Collection) {
    console.log(collection);
    this.apiService.createPageFromCollection(collection).subscribe((res) => {
      console.log(res);
    });
  }
}
