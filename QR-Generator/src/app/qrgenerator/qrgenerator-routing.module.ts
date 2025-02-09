// qrgenerator-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateConsumerComponent } from './Components/template-consumer/template-consumer.component';
import { DynamicFormComponent } from './Components/dynamic-form/dynamic-form.component';
import { PreviewComponent } from './Components/preview/preview.component';

const routes: Routes = [
  { path: 'qrgenerator', component: TemplateConsumerComponent }, 
  { path: 'dynamic-form', component: DynamicFormComponent }, 
  {path: 'preview', component: PreviewComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule],
})
export class QRGeneratorRoutingModule { }