import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { log } from 'node:util';
import { LoginComponent } from './Features/Auth/login/login.component';
import { ListTemplateComponent } from './Features/list-template/list-template.component';
import { AdminGuard } from './Features/Auth/admin.guard';
import { NotallowdComponent } from './Features/notallowd/notallowd.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            { path: 'index', component: IndexComponent, title: 'Sales Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: '', component: LoginComponent, title: 'login' },
            { path: 'login', component: LoginComponent, title: 'login' },
            { path: 'List Template', component: ListTemplateComponent, title: 'List Template', canActivate: [AdminGuard] },
            {path: 'not-allowed', component: NotallowdComponent, title: 'Not Allowed' },

        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
        ],
    },

    
];
