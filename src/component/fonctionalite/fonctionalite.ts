import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-fonctionalite',
  standalone: true,
  templateUrl: './fonctionalite.html',
  styleUrls: ['./fonctionalite.css'],
  imports:[FormsModule,CommonModule,NgClass], 
})
export class FonctionaliteComponent implements OnInit {
  isDarkMode = false;
  showThemeToggle = true; // pour cacher sur certaines pages

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    // Vérifier la route pour cacher le bouton sur connexion/inscription
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.showThemeToggle = !(url.includes('/connexion') || url.includes('/inscription'));
      });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    document.body.classList.toggle('dark', this.isDarkMode);
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }
}
