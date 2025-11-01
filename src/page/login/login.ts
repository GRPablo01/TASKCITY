import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from "../../component/icon/icon";
import { AuthService } from '../../../services/userService/Auth.Service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon],
  // ✅ Pas besoin de providers ici si AuthService a `providedIn: 'root'`
})
export class Login {
  passwordVisible = false;
  isLoading = false;
  message: string | null = null;
  errorMessage: string | null = null;
  redirectionApresConnexion: string | null = null;
  formSubmitted = false;
  rememberMe = false;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('utilisateur');
    if (saved) {
      const { email, password } = JSON.parse(saved);
      this.connexionData.email = email;
      this.connexionData.password = password;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  private saveUser(user: any): void {
    const sessionUser = {
      _id: user._id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email || '',
      role: (user.role || '').trim().toLowerCase(),
      initiale: user.initiale || ((user.prenom?.[0] ?? '').toUpperCase() + (user.nom?.[0] ?? '').toUpperCase()),
      equipe: user.equipe || '',
    };
    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
  }

  valider(): void {
    this.formSubmitted = true;
    if (!this.formulaireValide()) return;

    this.isLoading = true;

    this.http.post('http://localhost:3000/api/taskcity/login', this.connexionData).subscribe({
      next: (user: any) => {
        this.saveUser(user);
        this.authService.setUser(user);

        if (this.rememberMe) {
          localStorage.setItem('utilisateur', JSON.stringify(this.connexionData));
        } else {
          localStorage.removeItem('utilisateur');
        }

        const routeMap: Record<string, string> = {
          admin: '/accueil',
          'super admin': '/accueil',
          coach: '/accueil',
          joueur: '/accueil',
          inviter: '/accueil',
        };

        const roleKey = (user.role || 'joueur').toLowerCase();
        this.redirectionApresConnexion = routeMap[roleKey] || '/accueil';

        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        this.isLoading = false;
      },
    });
  }

  deconnecter(): void {
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/connexion']);
  }
}
