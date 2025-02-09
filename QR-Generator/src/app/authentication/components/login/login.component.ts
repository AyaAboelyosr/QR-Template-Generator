import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  showModal: boolean = false;
  isLoading: boolean = false;
  loginSuccess: boolean = false;
  loginError: boolean = false;
  showErrorSummary: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    Swal.fire({
      icon: type,
      title: msg,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });
  }


  onSubmit(): void {
    if (!this.email || !this.password) {
      this.showErrorSummary = true;
      return;
    }

    this.showErrorSummary = false;
    this.showModal = true;
    this.isLoading = true;
    this.loginSuccess = false;
    this.loginError = false;

    this.authService.login({ email: this.email, password: this.password }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.loginSuccess = true;
        
        setTimeout(() => {
          this.showModal = false;
          const role = this.authService.getRole();
          if (role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'Application User') {
            this.router.navigate(['/QRCodeGenerator/qrgenerator']);
          } else {
            this.router.navigate(['/auth/login']); 
          }
        }, 1000);
      },
      error: (error) => {
        this.showMessage('Invalid user . Please Register First.', 'error');
        this.loginError = true;

        setTimeout(() => {
          this.showModal = false;
        }, 1000);
      }
    });
  }
}
