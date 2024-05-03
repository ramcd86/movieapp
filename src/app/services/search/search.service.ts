import { Injectable, inject } from '@angular/core';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';
import MovieItem from '../data/classes/movie-item.class';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly dataService: DataService = inject(DataService);
  private readonly router: Router = inject(Router);

  public searchString = '';
  public movieSubject: BehaviorSubject<MovieItem> =
    new BehaviorSubject<MovieItem>(new MovieItem());

  constructor() {}

  public search(searchString: string): void {
    this.dataService.getMovieData(searchString).subscribe((data) => {
      if (data['Response'] === 'False') {
        this.router.navigate(['/error']);
      } else {
        this.movieSubject.next(data);
        this.router.navigate(['/results'], {
          onSameUrlNavigation: 'reload',
        });
      }
    });
  }

  public getSelectedMovie(): Observable<MovieItem> {
    return this.movieSubject.asObservable();
  }
}
