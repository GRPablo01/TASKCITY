import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // si tu as un fichier de routes

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),  // ✅ Fournit HttpClient pour tous les services
    provideRouter(routes) // si tu utilises le router
  ]
})
.catch(err => console.error(err));
