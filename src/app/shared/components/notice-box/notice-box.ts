import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCircleNotch,
  faCircleXmark,
  faInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

type AlertType = 'info' | 'loader' | 'warning' | 'error';

@Component({
  selector: 'app-notice-box',
  imports: [FaIconComponent],
  template: `<div [class]="'notice-box ' + type()">
    <div class="icon">
      @if (type() === 'info') {
        <fa-icon [icon]="faInfoIcon"></fa-icon>
      } @else if (type() === 'loader') {
        <fa-icon [icon]="faLoader"></fa-icon>
      } @else if (type() === 'warning') {
        <fa-icon [icon]="faWarning"></fa-icon>
      } @else if (type() === 'error') {
        <fa-icon [icon]="faError"></fa-icon>
      }
    </div>
    <div>
      <ng-content></ng-content>
    </div>
  </div>`,
  styleUrl: `./notice-box.scss`,
})
export class NoticeBox {
  // Icons
  faInfoIcon = faInfo;
  faLoader = faCircleNotch;
  faWarning = faTriangleExclamation;
  faError = faCircleXmark;

  type = input<AlertType>('info');
}
