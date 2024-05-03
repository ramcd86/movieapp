import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { inject } from '@angular/core';

export const mainResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const dataService: DataService = inject(DataService);

  return dataService.getHomePageMoviePopulation();
};
