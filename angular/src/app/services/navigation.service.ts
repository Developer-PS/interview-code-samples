import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo-client';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
    private tracker: MatomoTracker
  ) { }

  updateUrlParams(params: Params) {
    
    this.router.navigate([], {
      onSameUrlNavigation: "ignore",
      replaceUrl: true,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
