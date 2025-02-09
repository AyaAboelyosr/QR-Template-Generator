import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTemplateComponent } from './components/list-template/list-template.component';

import { TemplateItemComponent } from './components/template-item/template-item.component';

const routes: Routes = [
  { path: 'list-template', component: ListTemplateComponent  },
  { path: '', redirectTo: 'list-template', pathMatch: 'full' }, 
  { path: 'items/:id', component: TemplateItemComponent } 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrTemplateGeneratorRoutingModule {}