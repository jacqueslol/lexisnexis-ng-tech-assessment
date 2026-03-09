import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NoticeBox } from '../../shared/components/notice-box/notice-box';

@Component({
  selector: 'app-page-not-found',
  imports: [FaIconComponent, NoticeBox],
  standalone: true,
  template: `
    <app-notice-box [type]="'error'" [hideIcon]="true">
      <fa-icon [icon]="faWarning" size="3x"></fa-icon>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </app-notice-box>
  `,
})
export class PageNotFound {
  faWarning = faExclamationTriangle;
}
