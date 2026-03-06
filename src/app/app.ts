import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { StateController } from './shared/components/state-controller/state-controller';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, StateController],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('lexisnexis-ng-tech-assessment');
}
