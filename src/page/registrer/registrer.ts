import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Icon } from '../../component/icon/icon';
import { AuthService } from '../../../services/userService/Auth.Service';

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  codeProf?: string;
  role: 'prof' | 'eleve' | 'parent';
  dys?: string;
  dysListe?: string[];
  cguValide?: boolean;
  initiale?: string;
}

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Icon, RouterLink],
  templateUrl: './registrer.html',
})
export class Registrer implements OnInit, OnDestroy {

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'eleve',
    dys: '',
    dysListe: [],
    cguValide: false
  };

  etape = 1;
  actif: 'eleve' | 'prof' | 'parent' = 'eleve';
  passwordVisible = false;
  cguAccepte = false;
  message: string | null = null;
  isLoading = false;

  readonly CODE_PROF = 'PROF2025';
  readonly CODE_PARENT = 'PARENT2025';

  nouveauDys: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void { document.body.style.overflow = 'hidden'; }
  ngOnDestroy(): void { document.body.style.overflow = 'auto'; }

  togglePasswordVisibility() { this.passwordVisible = !this.passwordVisible; }

  // Passer à l'étape suivante
  suivant() {
    if (!this.inscriptionData.nom || !this.inscriptionData.prenom || !this.inscriptionData.email || !this.inscriptionData.password) {
      alert('Veuillez compléter tous les champs.');
      return;
    }
    this.etape = 2;
  }

  // Ajoute ou retire un dys du tableau dysListe
  toggleDys(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (!this.inscriptionData.dysListe) this.inscriptionData.dysListe = [];

    if (checkbox.checked) {
      if (!this.inscriptionData.dysListe.includes(value)) {
        this.inscriptionData.dysListe.push(value);
      }
    } else {
      this.inscriptionData.dysListe = this.inscriptionData.dysListe.filter(d => d !== value);
    }

    console.log('Dys sélectionnés :', this.inscriptionData.dysListe);
  }

  choisirRole(role: 'eleve' | 'prof' | 'parent') {
    this.actif = role;
    this.inscriptionData.role = role;
    if (role === 'eleve') this.inscriptionData.codeProf = '';
    console.log('Role choisi :', role);
  }

  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf, dys, dysListe } = this.inscriptionData;

    if (!nom || !prenom) return false;
    if (!this.isEmailValid(email)) return false;
    if (!password || password.length < 6) return false;
    if (role === 'prof' && codeProf !== this.CODE_PROF) return false;
    if (role === 'parent' && codeProf !== this.CODE_PARENT) return false;
    if (role === 'eleve' && (!dys && (!dysListe || dysListe.length === 0))) return false;
    if (!this.cguAccepte) return false;

    return true;
  }

  onCguChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.cguAccepte = checkbox.checked;
    this.inscriptionData.cguValide = checkbox.checked;
  }

  valider() {
    console.log('Début de la validation du formulaire');

    if (!this.formulaireValide()) {
      console.log('Formulaire invalide :', this.inscriptionData);
      alert('Veuillez compléter tous les champs correctement.');
      return;
    }

    this.isLoading = true;

    const initiale =
      (this.inscriptionData.prenom[0] ?? '').toUpperCase() +
      (this.inscriptionData.nom[0] ?? '').toUpperCase();

    const payload: InscriptionData = { ...this.inscriptionData, initiale, cguValide: this.cguAccepte };

    // Supprime le codeProf si ce n’est pas un prof ou parent
    if (payload.role !== 'prof' && payload.role !== 'parent') delete payload.codeProf;

    console.log('Payload envoyé au serveur :', payload);

    // Envoi vers le backend
    this.http.post('http://localhost:3000/api/dysone/users', payload).subscribe({
      next: (res: any) => {
        console.log('Réponse du serveur :', res);
        this.message = `Bienvenue sur UniDys !`;
        this.authService.setUser(res); // Sauvegarde l’utilisateur dans le service Auth
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/accueil']), 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.message = err?.error?.message || '⚠️ Erreur lors de la création du compte.';
        this.isLoading = false;
      }
    });
  }
}
