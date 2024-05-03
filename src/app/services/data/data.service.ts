import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, concat, concatMap, of, timer, toArray } from 'rxjs';
import { mockTop20 } from './mocks/top20';
import MovieItem from './classes/movie-item.class';

const noirList = [
  'Double+Indemnity',
  'The+Maltese+Falcon',
  'Touch+of+Evil',
  'Sunset+Boulevard',
  'The+Big+Sleep',
  'Chinatown',
  'The+Third+Man',
  'Out+of+the+Past',
  'The+Killers',
  'The+Postman+Always+Rings+Twice',
  'The+Night+of+the+Hunter',
  'Detour',
  'In+a+Lonely+Place',
  'Kiss+Me+Deadly',
  'Mildred+Pierce',
  'The+Lady+from+Shanghai',
  'The+Killing',
  'Laura',
  'Gilda',
  'Strangers+on+a+Train',
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http: HttpClient = inject(HttpClient);

  private urlBuilder(query: string): string {
    return `https://www.omdbapi.com?apikey=8ea39b15&t=${query}`;
  }

  public getMovieData(query: string): Observable<any> {
    return this.http.get(this.urlBuilder(query));
  }

  private mockToMovieItems(mocks: any): MovieItem[] {
    return mocks.map((mock: any) => {
      return new MovieItem()
        .setTitle(mock.Title)
        .setYear(mock.Year)
        .setRated(mock.Rated)
        .setReleased(mock.Released)
        .setRuntime(mock.Runtime)
        .setGenre(mock.Genre)
        .setDirector(mock.Director)
        .setWriter(mock.Writer)
        .setActors(mock.Actors)
        .setPlot(mock.Plot)
        .setLanguage(mock.Language)
        .setCountry(mock.Country)
        .setPoster(mock.Poster)
        .setResponse(mock.Response)
        .setImdbRating(mock.imdbRating)
        .setImdbVotes(mock.imdbVotes)
        .setImdbID(mock.imdbID)
        .setType(mock.Type)
        .setDvd(mock.DVD)
        .setBoxOffice(mock.BoxOffice)
        .setProduction(mock.Production)
        .setWebsite(mock.Website);
    });
  }

  public getHomePageMoviePopulation(): Observable<any> {
    return of(this.mockToMovieItems(mockTop20));
  }
}
