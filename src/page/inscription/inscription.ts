import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Registrer } from '../registrer/registrer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule,Registrer,RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('DysOne+ | Inscription');

    // Simuler un préchargement ou attendre les données nécessaires
    setTimeout(() => {
      this.isLoaded = true;
    }, 10); // tu peux remplacer par un vrai chargement de données
  }
}