import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true, // ✅ composant autonome
  imports: [Login, CommonModule, RouterLink],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']
})
export class Connexion implements OnInit, OnDestroy {

  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // 🧠 Titre dynamique de l’onglet
    this.titleService.setTitle('DysOne+ | Connexion');

    // 🚫 Désactiver le scroll pendant que cette page est affichée
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 🕐 Simulation d’un petit chargement (effet visuel)
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

  ngOnDestroy(): void {
    // ✅ Réactiver le scroll quand on quitte la page de connexion
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }
}
