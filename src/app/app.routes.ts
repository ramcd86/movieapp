import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { mainResolver } from './pages/main/main.resolver';
import { ResultsComponent } from './pages/results/results.component';
import { resultsResolver } from './pages/results/results.resolver';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    resolve: {
      mainData: mainResolver,
    },
  },
  {
    path: 'results',
    component: ResultsComponent,
    resolve: {
      resultsData: resultsResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
];
