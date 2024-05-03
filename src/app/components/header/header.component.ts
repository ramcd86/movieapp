import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { TextInputComponent } from '../text-input/text-input.component';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly SearchService: SearchService = inject(SearchService);
  private readonly router: Router = inject(Router);

  private movieQuery = '';

  public populateQuery($event: string): void {
    this.movieQuery = $event;
  }

  public handleSearch(): void {
    this.SearchService.search(this.movieQuery);
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
