import { loadRemoteModule } from '@angular-architects/native-federation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontendService {
  constructor() {}

  async loadRemoteComponent(remoteName: string, exposedModule = './Component') {
    try {
      return await loadRemoteModule({
        remoteName: remoteName,
        exposedModule,
      });
    } catch (error) {
      console.error(`Error loading ${remoteName} component:`, error);
    }
  }
}
