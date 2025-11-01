import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { Accueil } from '../page/accueil/accueil';


export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription},
    { path: 'accueil', component: Accueil},

];
