import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordMismatchError: boolean = false;
  formInvalid: boolean = false;
  
  showModal: boolean = false;
  isLoading: boolean = false;
  registrationSuccess: boolean = false;
  registrationError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateForm(): boolean {
    if (!this.email || !this.firstName || !this.lastName || !this.password || !this.confirmPassword) {
      this.formInvalid = true;
      return false;
    }
    this.formInvalid = false;
    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    if (this.password !== this.confirmPassword) {
      this.passwordMismatchError = true;
      return;
    }
    this.passwordMismatchError = false;

    this.showModal = true;
    this.isLoading = true;
    this.registrationSuccess = false;
    this.registrationError = false;

    const registrationData = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.registrationSuccess = true;

          // Store the role from response
          if (response.role) {
            this.authService.setRole(response.role);
          }

          let redirectUrl = '/auth/login';
          if (response.role === 'Admin') {
            redirectUrl = '/admin';
          } else if (response.role === 'Employee') {
            redirectUrl = '/QRCodeGenerator/qrgenerator';
          }

          setTimeout(() => {
            this.showModal = false;
            this.resetForm();
            this.router.navigate([redirectUrl]);
          }, 2000);
        }, 1500);
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.registrationError = true;
          setTimeout(() => {
            this.showModal = false;
          }, 2000);
        }, 1500);

        console.error('Registration failed:', error);
      }
    });
  }

  private resetForm(): void {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.confirmPassword = '';
    this.formInvalid = false;
  }
}
