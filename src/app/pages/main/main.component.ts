import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import MovieItem from '../../services/data/classes/movie-item.class';
import { MovieTileComponent } from '../../components/movie-tile/movie-tile.component';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    TextInputComponent,
    ButtonComponent,
    CommonModule,
    MovieTileComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly searchService: SearchService = inject(SearchService);

  public readonly sort = {
    RATING: 'rating',
    YEAR: 'year',
    ALPHABETICALLY: 'alphabetically',
  };

  public readonly sortOrder = {
    ASC: 'asc',
    DESC: 'desc',
  };

  private sortingWorker: Worker;

  public mockDataFromResolver$?: Observable<any>;
  public topMoviesList: MovieItem[] = [];

  public alphaSort?: string;
  public ratingSort?: string;
  public yearSort?: string;

  constructor() {
    this.sortingWorker = new Worker(
      new URL('../../services/workers/sort-worker.ts', import.meta.url)
    );
  }

  public ngOnInit(): void {
    this.mockDataFromResolver$ = this.activatedRoute.data.pipe(
      map((data) => data['mainData'])
    );
    this.mockDataFromResolver$.subscribe((data) => {
      this.topMoviesList = data;
    });
  }

  public search(searchString?: string): void {
    this.searchService.search(searchString ?? '');
  }

  public sortBy(sortBy: string): void {
    switch (sortBy) {
      case this.sort.RATING:
        this.ratingSort =
          this.ratingSort === this.sortOrder.DESC || !this.ratingSort
            ? this.sortOrder.ASC
            : this.sortOrder.DESC;
        break;
      case this.sort.YEAR:
        this.yearSort =
          this.yearSort === this.sortOrder.DESC || !this.yearSort
            ? this.sortOrder.ASC
            : this.sortOrder.DESC;
        break;
      case this.sort.ALPHABETICALLY:
        this.alphaSort =
          this.alphaSort === this.sortOrder.DESC || !this.alphaSort
            ? this.sortOrder.ASC
            : this.sortOrder.DESC;
        break;
      default:
        break;
    }
    this.sortingWorker.postMessage({
      movies: this.topMoviesList,
      sortBy,
      rateDir: this.ratingSort,
      yearDir: this.yearSort,
      alphaDir: this.alphaSort,
    });
    this.sortingWorker.onmessage = ({ data }) => {
      this.topMoviesList = data.map((movieItem: any) =>
        new MovieItem()
          .setTitle(movieItem.title)
          .setYear(movieItem.year)
          .setRated(movieItem.rated)
          .setReleased(movieItem.released)
          .setRuntime(movieItem.runtime)
          .setGenre(movieItem.genre)
          .setDirector(movieItem.director)
          .setWriter(movieItem.writer)
          .setPlot(movieItem.plot)
          .setLanguage(movieItem.language)
          .setCountry(movieItem.country)
          .setPoster(movieItem.poster)
          .setImdbRating(movieItem.imdbRating)
          .setImdbVotes(movieItem.imdbVotes)
          .setImdbID(movieItem.imdbID)
          .setType(movieItem.type)
          .setDvd(movieItem.dvd)
          .setBoxOffice(movieItem.boxOffice)
          .setProduction(movieItem.production)
          .setWebsite(movieItem.website)
          .setResponse(movieItem.response)
      );
    };
  }
}
