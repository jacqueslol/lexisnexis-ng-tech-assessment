import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-state-controller',
  imports: [FormsModule],
  templateUrl: './state-controller.html',
  styleUrl: './state-controller.scss',
})
export class StateController {
  showController = true;
  loadingDuration = localStorage.getItem('loadingDuration') || '1000';
  simulateError = localStorage.getItem('simulateError') === 'true';

  saveState() {
    localStorage.setItem('loadingDuration', this.loadingDuration);
    localStorage.setItem('simulateError', this.simulateError.toString());
    window.location.reload();
  }
}
