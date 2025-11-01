import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/userService/Profil.Service';
import { Icon } from '../icon/icon';

interface MenuItem {
  title: string;
  link: string;
  icon?: string;
  initiales?: string;
}

interface MobileMenu {
  title: string;
  icon?: string;
  link?: string;
  items: MenuItem[];
  initiales?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, AfterViewInit {
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  isDarkMode = false;
  unreadMessages = 0;
  connectedUser: any = null;
  mobileMenus: MobileMenu[] = [];

  private scrollPosition = 0;

  @ViewChild('mobileMenu') mobileMenuRef!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    private userProfileService: ProfileService
  ) {
    // Récupérer le thème sauvegardé
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    }
  }

  ngOnInit(): void {
    this.loadConnectedUser();
  }

  ngAfterViewInit(): void {
    if (this.mobileMenuRef) this.addScrollLock(this.mobileMenuRef.nativeElement);
  }

  private loadConnectedUser(): void {
    const utilisateurStorage = localStorage.getItem('utilisateur');
    if (!utilisateurStorage) {
      this.buildMobileMenus('Invité');
      return;
    }
    const utilisateur = JSON.parse(utilisateurStorage);
    utilisateur.initiales = this.getInitiales(utilisateur.nom, utilisateur.prenom);
    this.connectedUser = utilisateur;
    this.buildMobileMenus(utilisateur.role || 'Invité');
  }

  private buildMobileMenus(role: string): void {
    this.mobileMenus = [
      { title: 'Dashboard', icon: 'fas fa-chart-line', link: '/dashboard', items: [] },
      { title: 'Mes tâches', icon: 'fas fa-list-check', link: '/taches', items: [
        { title: 'Tâches du jour', link: '/taches/jour', icon: 'fas fa-calendar-day' },
        { title: 'Tâches terminées', link: '/taches/done', icon: 'fas fa-check-circle' }
      ]},
      { title: 'Projets', icon: 'fas fa-diagram-project', link: '/projets', items: [
        { title: 'Mes projets', link: '/projets/mes', icon: 'fas fa-folder-open' },
        { title: 'Nouveau projet', link: '/projets/nouveau', icon: 'fas fa-plus-circle' }
      ]},
      { title: 'Planning', icon: 'fas fa-calendar-days', link: '/planning', items: [] },
      { title: 'Priorités', icon: 'fas fa-flag', link: '/priorites', items: [] },
      { title: 'Profil', icon: 'fas fa-user-circle', link: '/profil', items: [
        { title: 'Mon compte', link: '/profil/compte', icon: 'fas fa-id-card' },
        { title: 'Paramètres', link: '/profil/parametres', icon: 'fas fa-gear' }
      ]}
    ];
  }

  get mobileMenuOpen(): boolean { return this._mobileMenuOpen; }
  set mobileMenuOpen(value: boolean) {
    this._mobileMenuOpen = value;
    if (value) {
      this.scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
      window.scrollTo(0, this.scrollPosition);
    }
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }
  closeDropdown(id: string): void { if (this.activeDropdown === id) this.activeDropdown = null; }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) this.activeDropdown = null;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    if (this.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }

  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.userProfileService.clearProfile();
    this.router.navigate(['/connexion']);
  }

  private getInitiales(nom: string, prenom: string): string {
    const n = nom?.charAt(0) || '';
    const p = prenom?.charAt(0) || '';
    return (p+n).toUpperCase();
  }

  private addScrollLock(menuEl: HTMLElement) {
    let startY = 0;
    menuEl.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: false });
    menuEl.addEventListener('touchmove', e => {
      const scrollTop = menuEl.scrollTop, scrollHeight = menuEl.scrollHeight, offsetHeight = menuEl.offsetHeight;
      const direction = e.touches[0].clientY - startY;
      if ((scrollTop===0 && direction>0) || (scrollTop+offsetHeight>=scrollHeight && direction<0)) e.preventDefault();
    }, { passive: false });
    menuEl.addEventListener('wheel', e => {
      const scrollTop = menuEl.scrollTop, scrollHeight = menuEl.scrollHeight, offsetHeight = menuEl.offsetHeight;
      const delta = e.deltaY;
      if ((scrollTop===0 && delta<0) || (scrollTop+offsetHeight>=scrollHeight && delta>0)) e.preventDefault();
    }, { passive: false });
  }
}
