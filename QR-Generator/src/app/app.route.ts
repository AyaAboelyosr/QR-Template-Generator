import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthLayout } from './layouts/auth-layout';
import { AdminGuard } from './authentication/guards/admin.guard';
import { authGuard} from './authentication/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, 
  
    { 
      path: 'QRCodeGenerator', 
      loadChildren: () => import('./qrgenerator/qrgenerator.module')
                        .then(m => m.QRGeneratorModule),
      canActivate: [authGuard] 
    },
    { 
      path: 'auth',
      component: AuthLayout, 
      loadChildren: () => import('./authentication/authentication.module')
                        .then(m => m.AuthenticationModule)
    },
    { 
      path: 'admin', 
      loadChildren: () => import('./qrtemplategenerator/qrtemplategenerator.module')
                        .then(m => m.QrtemplategeneratorModule),
      canActivate: [AdminGuard] 
    },
    { path: '**', redirectTo: '/auth/login' }  
  ];