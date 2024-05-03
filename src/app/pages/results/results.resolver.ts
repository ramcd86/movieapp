import { SearchService } from './../../services/search/search.service';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const resultsResolver: ResolveFn<Observable<any>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const searchService: SearchService = inject(SearchService);
  return searchService.getSelectedMovie();
};
