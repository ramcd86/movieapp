import { Component, EventEmitter, Input, Output } from '@angular/core';
import MovieItem from '../../services/data/classes/movie-item.class';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-movie-tile',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './movie-tile.component.html',
  styleUrl: './movie-tile.component.scss',
})
export class MovieTileComponent {
  @Input() movieItem?: MovieItem;
  @Output() emitMovie: EventEmitter<MovieItem> = new EventEmitter<MovieItem>();

  public getRoundedImbdbRating(): number {
    const rating = this.movieItem?.getImdbRating()
      ? parseInt(this.movieItem?.getImdbRating())
      : 0;
    return Math.floor(rating);
  }
}
