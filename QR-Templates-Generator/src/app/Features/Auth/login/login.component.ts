import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { AuthService } from 'src/app/service/auth.service';
import { jwtDecode } from 'jwt-decode';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('toggleAnimation', [
        transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
        transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
],
})
export class LoginComponent implements OnInit {
  form!:FormGroup;
  ngOnInit(): void {
    this.initform();
  }


  store: any;
  constructor(public translate: TranslateService, public storeData: Store<any>, public router: Router, private appSetting: AppService, private fb: FormBuilder , private _AuthService: AuthService) {
      this.initStore();
  }
  async initStore() {
      this.storeData
          .select((d) => d.index)
          .subscribe((d) => {
              this.store = d;
          });
  }

  changeLanguage(item: any) {
      this.translate.use(item.code);
      this.appSetting.toggleLanguage(item);
      if (this.store.locale?.toLowerCase() === 'ae') {
          this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
      } else {
          this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
      }
      window.location.reload();
  }

  initform() {
    this.form = this.fb.group({
        Email: ['',[ Validators.required, Validators.email]],
        Password: ['',[ Validators.required]],
    });

  }
  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this._AuthService.login(this.form.value).subscribe(
        (res: any) => {
          
          if (res.token) {
            localStorage.setItem('token', res.token);
            const decodedToken: any =jwtDecode(res.token);
            const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            
            this._AuthService.setRole(role); 
            if (role === 'Admin') {
              this.router.navigate(['/List Template']); 
            } else {
              this.router.navigate(['/not-allowed']); 
            }
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
  

    
  
  }
 


