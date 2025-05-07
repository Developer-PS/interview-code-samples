import { AfterViewInit, Component, VERSION } from '@angular/core';
import { NavigationEnd, NavigationSkipped, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './main/navbar/navbar.component';
import { HeaderComponent } from './main/header/header.component';
import { FooterComponent } from './main/footer/footer.component';
import { SettingsbarComponent } from './main/settingsbar/settingsbar.component';
import { WakelockService } from './services/wakelock.service';
import { run } from 'vanilla-cookieconsent';
import { cookieConsentConfig } from './config/cookieconsent';
//import { MatomoTracker } from 'ngx-matomo-client';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    HeaderComponent,
    SettingsbarComponent,
    RouterLink,
    RouterLinkActive,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {

  constructor(
    private wakeLockSerive: WakelockService,
//    private tracker: MatomoTracker,
    private router: Router
  ){
    let skipped_ids : number[] = []
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationSkipped) // Filter only NavigationEnd events
      )
      .subscribe((event: NavigationSkipped) => {
        skipped_ids.push(event.id)
      })

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Filter only NavigationEnd events
      )
      .subscribe((event: NavigationEnd) => {
        if(skipped_ids.includes(event.id)) {
          skipped_ids = skipped_ids.filter(id => id !== event.id)
        } else {
        }
      })
  }

  ngAfterViewInit(): void {
    run(cookieConsentConfig(
    //  this.tracker
    ));
  }
}
