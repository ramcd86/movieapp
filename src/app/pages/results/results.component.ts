import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import MovieItem from '../../services/data/classes/movie-item.class';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public selectedMovie?: MovieItem;

  public ngOnInit(): void {
    window.scrollTo(0, 0);
    this.activatedRoute.data.subscribe((data) => {
      const movie = data['resultsData'];
      this.selectedMovie = new MovieItem()
        .setTitle(movie.Title)
        .setYear(movie.Year)
        .setRated(movie.Rated)
        .setReleased(movie.Released)
        .setRuntime(movie.Runtime)
        .setGenre(movie.Genre)
        .setDirector(movie.Director)
        .setWriter(movie.Writer)
        .setActors(movie.Actors)
        .setAwards(movie.Awards)
        .setRatings(movie.Ratings)
        .setPlot(movie.Plot)
        .setLanguage(movie.Language)
        .setCountry(movie.Country)
        .setPoster(movie.Poster)
        .setResponse(movie.Response)
        .setImdbRating(movie.imdbRating)
        .setImdbVotes(movie.imdbVotes)
        .setImdbID(movie.imdbID)
        .setType(movie.Type)
        .setDvd(movie.DVD)
        .setBoxOffice(movie.BoxOffice)
        .setProduction(movie.Production)
        .setWebsite(movie.Website);
    });
  }

  public getRoundedImbdbRating(): number {
    const rating = this.selectedMovie?.getImdbRating()
      ? parseInt(this.selectedMovie?.getImdbRating())
      : 0;
    return Math.floor(rating);
  }
}
