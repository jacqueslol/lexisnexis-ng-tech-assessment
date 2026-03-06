import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-not-found',
  imports: [FaIconComponent],
  standalone: true,
  template: `
    <fa-icon [icon]="faWarning" size="3x"></fa-icon>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  `,
})
export class PageNotFound {
  faWarning = faExclamationTriangle;
}
